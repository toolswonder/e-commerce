import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { ArrowLeft, Printer } from "lucide-react";
import { OrderManageForm } from "./order-manage-form";
import { PrintInvoiceButton } from "@/app/(storefront)/account/orders/[id]/print-button";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) {
    notFound();
  }

  const shippingDetails: any = order.shippingDetails || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-light text-zinc-950">
              Fulfillment: {order.orderNumber}
            </h1>
            <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-zinc-900 text-white">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-zinc-400">Received on {formatDate(order.createdAt)}</p>
        </div>

        <PrintInvoiceButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Line Items & Patron Address */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recipient Address */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-3 shadow-sm">
            <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
              Shipping &amp; Recipient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600">
              <div>
                <p className="font-semibold text-zinc-900">{shippingDetails.recipient || order.user?.name || "Patron"}</p>
                <p>{shippingDetails.street} {shippingDetails.apartment}</p>
                <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.postalCode}</p>
                <p>{shippingDetails.country || "US"}</p>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Contact</p>
                <p>{shippingDetails.email || order.user?.email || order.guestEmail}</p>
                <p>{shippingDetails.phone}</p>
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
            <div className="p-4 bg-zinc-50 border-b border-zinc-100">
              <h3 className="font-serif text-base font-medium text-zinc-950">
                Purchased Objects Snapshot
              </h3>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Piece</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5 text-center">Qty</th>
                  <th className="p-3.5 text-right">Price</th>
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

            {/* Calculations Breakdown */}
            <div className="p-5 border-t border-zinc-200 flex justify-end bg-zinc-50/50">
              <div className="w-64 space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">{formatPrice(order.subtotal)}</span>
                </div>
                {Number(order.discountTotal) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({order.couponCode})</span>
                    <span>-{formatPrice(order.discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shippingTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8.5%)</span>
                  <span>{formatPrice(order.taxTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 border-t border-zinc-200 pt-2">
                  <span>Grand Total</span>
                  <span>{formatPrice(order.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Manage Status & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <OrderManageForm
            orderId={order.id}
            currentStatus={order.status}
            currentTracking={order.trackingNumber}
            currentCarrier={order.shippingCarrier}
          />
        </div>
      </div>
    </div>
  );
}
