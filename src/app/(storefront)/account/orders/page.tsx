import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Truck, ArrowRight } from "lucide-react";

export default async function AccountOrdersPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="font-serif text-2xl font-light text-zinc-950">
          My Orders &amp; Shipment Tracking
        </h1>
        <p className="text-xs text-zinc-500 font-light mt-1">
          Review your order history, view tracking numbers, and download invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-zinc-50 rounded-2xl border border-zinc-100 p-8">
          <Package className="w-10 h-10 mx-auto text-zinc-400 stroke-1" />
          <h3 className="font-serif text-base text-zinc-900">No Orders Recorded</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You haven&apos;t placed any orders yet. Discover our handmade collection.
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-xl border border-zinc-200/80 p-5 space-y-4 hover:border-zinc-300 transition-colors"
            >
              {/* Order header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-zinc-950">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                    {ord.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>Ordered {formatDate(ord.createdAt)}</span>
                  <span className="font-semibold text-zinc-950">{formatPrice(ord.grandTotal)}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 text-xs">
                {ord.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-zinc-700">
                    <div>
                      <span className="font-medium text-zinc-900">{item.title}</span>
                      {item.variantName && (
                        <span className="text-zinc-500 text-[11px] ml-1.5">
                          ({item.variantName})
                        </span>
                      )}
                      <span className="text-zinc-400 text-[11px] ml-1.5">× {item.quantity}</span>
                    </div>
                    <span>{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              {/* Tracking bar if available */}
              {ord.trackingNumber && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 text-[11px] text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Carrier: {ord.shippingCarrier || "FedEx Freight"}</span>
                    <span className="font-mono font-medium text-zinc-900">
                      ({ord.trackingNumber})
                    </span>
                  </div>
                  <span className="text-emerald-700 font-medium">In Transit</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end pt-2">
                <Link
                  href={`/account/orders/${ord.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium transition-colors"
                >
                  View Order Breakdown &amp; Invoice <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
