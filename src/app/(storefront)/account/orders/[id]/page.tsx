import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { ArrowLeft, Printer, Truck, ShieldCheck, Mail } from "lucide-react";
import { PrintInvoiceButton } from "./print-button";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/account/orders/${id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
          },
        },
      },
      payments: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Authorize: customer must own the order or be an admin
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/account/orders");
  }

  const shippingDetails: any = order.shippingDetails || {};

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 print:hidden">
        <div className="space-y-1">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-light text-zinc-950">
              Order {order.orderNumber}
            </h1>
            <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-zinc-400">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <PrintInvoiceButton />
      </div>

      {/* Invoice Card (Print-Ready) */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-10 space-y-8 shadow-sm print:border-none print:shadow-none">
        {/* Printable Brand Header */}
        <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-[0.2em] text-zinc-950">
              AURA
            </h2>
            <p className="text-[11px] text-zinc-500 mt-1">Curated Minimalist Living Atelier</p>
            <p className="text-[11px] text-zinc-400">concierge@auraliving.com</p>
          </div>
          <div className="text-right space-y-1">
            <p className="font-mono text-sm font-bold text-zinc-950">{order.orderNumber}</p>
            <p className="text-xs text-zinc-500">{formatDate(order.createdAt)}</p>
            <p className="text-xs font-semibold text-emerald-700">
              Payment: {order.payments[0]?.status || "COMPLETED"} ({order.payments[0]?.provider || "STRIPE"})
            </p>
          </div>
        </div>

        {/* Shipping & Recipient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-600">
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-zinc-900 mb-1.5">
              Deliver To:
            </h3>
            <p className="font-medium text-zinc-900">{shippingDetails.recipient || session.user.name}</p>
            <p>{shippingDetails.street} {shippingDetails.apartment}</p>
            <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.postalCode}</p>
            <p>{shippingDetails.country || "United States"}</p>
            {shippingDetails.phone && <p className="mt-1 text-zinc-400">{shippingDetails.phone}</p>}
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-zinc-900 mb-1.5">
              Shipment Tracking:
            </h3>
            <p className="font-medium text-zinc-900">
              Carrier: {order.shippingCarrier || "FedEx Freight"}
            </p>
            <p className="font-mono text-zinc-700">
              Tracking #: {order.trackingNumber || "Pending Dispatch"}
            </p>
            <p className="text-zinc-500 mt-1">
              Method: Insured White-Glove Handover
            </p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Object &amp; Specification</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-right">Unit Price</th>
                <th className="p-3.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3.5">
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    {item.variantName && (
                      <p className="text-[11px] text-zinc-500">{item.variantName}</p>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-zinc-500">{item.sku}</td>
                  <td className="p-3.5 text-center font-medium text-zinc-900">{item.quantity}</td>
                  <td className="p-3.5 text-right text-zinc-700">{formatPrice(item.price)}</td>
                  <td className="p-3.5 text-right font-semibold text-zinc-950">
                    {formatPrice(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-64 space-y-2 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-zinc-900">{formatPrice(order.subtotal)}</span>
            </div>
            {Number(order.discountTotal) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode || "PROMO"})</span>
                <span>-{formatPrice(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Insured Freight</span>
              <span>{Number(order.shippingTotal) === 0 ? "Complimentary" : formatPrice(order.shippingTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (8.5%)</span>
              <span>{formatPrice(order.taxTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-950 border-t border-zinc-200 pt-2.5">
              <span>Grand Total</span>
              <span>{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
