"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { processCheckout } from "@/server/actions/checkout.actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    subtotal,
    couponCode,
    discountAmount,
    shippingTotal,
    taxTotal,
    grandTotal,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "Sophia Vance",
    email: session?.user?.email || "customer@example.com",
    phone: "+1 (555) 019-2834",
    street: "742 Evergreen Terrace",
    apartment: "Suite 4B",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    country: "US",
    paymentProvider: "STRIPE" as "STRIPE" | "RAZORPAY" | "CASH_ON_DELIVERY",
    cardNumber: "4242 •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "888",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: session.user.name || prev.fullName,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
        <h2 className="font-serif text-2xl font-light text-zinc-950">
          Your Cart is Empty
        </h2>
        <p className="text-xs text-zinc-500">
          Please add items to your shopping cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block mt-2 px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await processCheckout({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        paymentProvider: formData.paymentProvider,
        couponCode,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
        })),
      });

      if (!res.success) {
        setErrorMsg(res.error || "Checkout failed. Please try again.");
        setLoading(false);
        return;
      }

      // Order created successfully
      clearCart();
      router.push(`/checkout/success?orderNumber=${res.orderNumber}`);
    } catch {
      setErrorMsg("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-100 pb-4 flex items-center justify-between">
        <div>
          <nav className="text-xs text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Link href="/cart" className="hover:text-zinc-900">
              Cart
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Checkout</span>
          </nav>
          <h1 className="font-serif text-3xl font-light text-zinc-950 mt-1">
            Sanctuary Order Checkout
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Encrypted 256-Bit SSL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckoutSubmit} className="space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Customer Contact Info */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-medium text-zinc-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">
                  1
                </span>
                Patron Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address (For Invoices &amp; Tracking)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Mobile Phone (For Courier Notifications)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <h2 className="font-serif text-lg font-medium text-zinc-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">
                  2
                </span>
                Delivery Destination
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 742 Evergreen Terrace"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Suite / Apt
                    </label>
                    <input
                      type="text"
                      placeholder="Suite 4B"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      State / Region
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-4 pt-6 border-t border-zinc-100">
              <h2 className="font-serif text-lg font-medium text-zinc-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[11px] font-mono flex items-center justify-center font-bold">
                  3
                </span>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setFormData({ ...formData, paymentProvider: "STRIPE" })}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                    formData.paymentProvider === "STRIPE"
                      ? "border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-900">Credit / Debit Card</span>
                    <CreditCard className="w-4 h-4 text-zinc-700" />
                  </div>
                  <span className="text-[11px] text-zinc-500">Stripe Verified Gateway</span>
                </label>

                <label
                  onClick={() => setFormData({ ...formData, paymentProvider: "RAZORPAY" })}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                    formData.paymentProvider === "RAZORPAY"
                      ? "border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-900">Razorpay</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      UPI / Card
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500">Instant UPI &amp; Cards</span>
                </label>

                <label
                  onClick={() => setFormData({ ...formData, paymentProvider: "CASH_ON_DELIVERY" })}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                    formData.paymentProvider === "CASH_ON_DELIVERY"
                      ? "border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-900">Pay on Delivery</span>
                    <Truck className="w-4 h-4 text-zinc-700" />
                  </div>
                  <span className="text-[11px] text-zinc-500">Upon White-Glove Handover</span>
                </label>
              </div>

              {/* Card inputs simulation if card selected */}
              {formData.paymentProvider === "STRIPE" && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3 mt-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold uppercase tracking-wider gap-2 shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Authorizing &amp; Placing Order...
                </>
              ) : (
                <>
                  Place Sanctuary Order ({formatPrice(grandTotal)}) <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: Order Summary Preview */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/80 space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-medium text-zinc-950">
              Order Review ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Line items preview */}
            <div className="divide-y divide-zinc-200/60 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-zinc-900 truncate">
                      {item.title}
                    </h4>
                    {item.variantTitle && (
                      <p className="text-[11px] text-zinc-500">{item.variantTitle}</p>
                    )}
                    <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-zinc-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-zinc-600 border-t border-zinc-200/80 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Savings ({couponCode})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Freight Delivery</span>
                <span>{shippingTotal === 0 ? "Complimentary" : formatPrice(shippingTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>State &amp; Local Sales Tax (8.5%)</span>
                <span>{formatPrice(taxTotal)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-zinc-950 border-t border-zinc-200 pt-3">
                <span>Total Due</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="text-xs text-zinc-500 flex items-center justify-center gap-2 pt-2 border-t border-zinc-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full 30-Day In-Home Sanctuary Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
