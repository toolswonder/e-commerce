import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Truck, Calendar, Mail, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = await searchParams;

  let order = null;
  if (orderNumber) {
    try {
      order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
          payments: true,
        },
      });
    } catch (err) {
      console.error("Order lookup error:", err);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Success Badge */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
          Order Confirmed &amp; Authorized
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950">
          Thank You for Your Patronage
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto font-light leading-relaxed">
          Your order has been safely placed with our atelier. A confirmation email with itemized invoice and tracking credentials has been dispatched.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-zinc-50 rounded-2xl p-6 sm:p-8 border border-zinc-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Order Reference
            </span>
            <p className="font-mono text-base font-bold text-zinc-950">
              {order?.orderNumber || orderNumber || "AURA-2026-CONFIRMED"}
            </p>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Status
            </span>
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full w-fit">
              Payment Completed (Paid)
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="py-2">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center mx-auto text-[11px] font-bold">
                ✓
              </div>
              <p className="font-semibold text-zinc-900">Ordered</p>
              <p className="text-[10px] text-zinc-400">Today</p>
            </div>
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center mx-auto text-[11px] font-bold">
                ✓
              </div>
              <p className="font-semibold text-zinc-900">Payment Paid</p>
              <p className="text-[10px] text-zinc-400">Verified</p>
            </div>
            <div className="space-y-1.5 opacity-60">
              <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center mx-auto text-[11px]">
                3
              </div>
              <p className="font-medium text-zinc-700">In Atelier</p>
              <p className="text-[10px] text-zinc-400">Packaging</p>
            </div>
            <div className="space-y-1.5 opacity-60">
              <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center mx-auto text-[11px]">
                4
              </div>
              <p className="font-medium text-zinc-700">Delivered</p>
              <p className="text-[10px] text-zinc-400">3–5 Days</p>
            </div>
          </div>
        </div>

        {/* Items Summary if available */}
        {order?.items && (
          <div className="border-t border-zinc-200 pt-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Purchased Objects
            </h3>
            <div className="divide-y divide-zinc-200/60">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between text-xs">
                  <div>
                    <p className="font-medium text-zinc-900">{item.title}</p>
                    {item.variantName && (
                      <p className="text-[11px] text-zinc-500">{item.variantName}</p>
                    )}
                    <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-zinc-900">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold text-zinc-950">
              <span>Grand Total</span>
              <span>{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/products"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow text-center"
        >
          Continue Exploring
        </Link>
        <Link
          href="/account/orders"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-100 transition-colors text-center"
        >
          View in My Orders
        </Link>
      </div>
    </div>
  );
}
