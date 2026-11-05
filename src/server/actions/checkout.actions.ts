"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  street: z.string().min(3, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().default("US"),
  paymentProvider: z.enum(["STRIPE", "RAZORPAY", "CASH_ON_DELIVERY"]).default("STRIPE"),
  couponCode: z.string().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional().nullable(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export async function processCheckout(input: CheckoutInput) {
  const session = await getAuthSession();
  const userId = session?.user?.id || null;

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message || "Validation failed",
    };
  }

  const {
    fullName,
    email,
    phone,
    street,
    apartment,
    city,
    state,
    postalCode,
    country,
    paymentProvider,
    couponCode,
    items,
  } = parsed.data;

  try {
    // 1. Fetch live products from database to ensure price integrity
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (dbProducts.length === 0) {
      return { success: false, error: "One or more products are unavailable." };
    }

    let calculatedSubtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const prod = dbProducts.find((p) => p.id === item.productId);
      if (!prod) continue;

      let unitPrice = Number(prod.salePrice || prod.price);
      let variantName: string | null = null;
      let sku = prod.sku;

      if (item.variantId) {
        const variant = prod.variants.find((v) => v.id === item.variantId);
        if (variant) {
          variantName = variant.title;
          sku = variant.sku;
          if (variant.price) unitPrice = Number(variant.price);
        }
      }

      const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
      calculatedSubtotal += lineTotal;

      orderItemsData.push({
        productId: prod.id,
        variantId: item.variantId || null,
        title: prod.title,
        variantName,
        sku,
        price: unitPrice,
        quantity: item.quantity,
        total: lineTotal,
      });
    }

    // 2. Validate coupon on server
    let discountAmount = 0;
    if (couponCode) {
      const cleanCoupon = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCoupon, isActive: true },
      });

      if (coupon) {
        if (!coupon.minOrderValue || calculatedSubtotal >= Number(coupon.minOrderValue)) {
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (calculatedSubtotal * Number(coupon.discountValue)) / 100;
          } else {
            discountAmount = Math.min(calculatedSubtotal, Number(coupon.discountValue));
          }

          if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
            discountAmount = Number(coupon.maxDiscount);
          }

          // Increment coupon usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    discountAmount = Number(discountAmount.toFixed(2));

    // 3. Shipping rate
    const shippingTotal = calculatedSubtotal >= 150 ? 0 : 15.0;

    // 4. Sales Tax: 8.5%
    const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount);
    const taxTotal = Number((taxableAmount * 0.085).toFixed(2));

    // 5. Grand Total
    const grandTotal = Number((taxableAmount + shippingTotal + taxTotal).toFixed(2));

    // 6. Generate order
    const orderNumber = generateOrderNumber();
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        guestEmail: !userId ? email : null,
        status: "PAID",
        currency: "USD",
        subtotal: calculatedSubtotal,
        discountTotal: discountAmount,
        shippingTotal,
        taxTotal,
        grandTotal,
        couponCode: couponCode || null,
        shippingCarrier: "Standard Carbon-Neutral Freight",
        trackingNumber: `AURA-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        idempotencyKey,
        shippingDetails: {
          recipient: fullName,
          email,
          phone,
          street,
          apartment,
          city,
          state,
          postalCode,
          country,
        },
        items: {
          create: orderItemsData,
        },
        payments: {
          create: {
            provider: paymentProvider,
            status: "COMPLETED",
            transactionId: `tx_${paymentProvider.toLowerCase()}_${Date.now()}`,
            amount: grandTotal,
            currency: "USD",
          },
        },
      },
      include: {
        items: true,
      },
    });

    // Save address for registered user if none exists
    if (userId) {
      const existingAddr = await prisma.address.findFirst({ where: { userId } });
      if (!existingAddr) {
        await prisma.address.create({
          data: {
            userId,
            fullName,
            phone,
            street,
            apartment,
            city,
            state,
            postalCode,
            country,
            isDefault: true,
          },
        });
      }
    }

    // Decrement inventory stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      grandTotal,
    };
  } catch (err) {
    console.error("Order processing error:", err);
    return {
      success: false,
      error: "An error occurred while creating your order. Please try again.",
    };
  }
}
