import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Package, Heart, MapPin, ArrowRight } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export default async function AccountOverviewPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const [orders, addressCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        items: true,
      },
    }),
    prisma.address.count({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-light text-zinc-950">
          Welcome back, {session.user.name || "Patron"}
        </h1>
        <p className="text-xs text-zinc-500 font-light mt-1">
          Review your recent acquisitions, active deliveries, and account settings.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Total Orders
          </span>
          <p className="font-serif text-2xl font-medium text-zinc-950">{orders.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Saved Addresses
          </span>
          <p className="font-serif text-2xl font-medium text-zinc-950">{addressCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Patron Tier
          </span>
          <p className="font-serif text-2xl font-medium text-amber-800">Sanctuary Circle</p>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h2 className="font-serif text-lg font-medium text-zinc-950">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-zinc-100">
            No orders placed yet. Your acquisitions will appear here.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-xl overflow-hidden bg-white">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-900">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Placed on {formatDate(ord.createdAt)} · {ord.items.length} item{ord.items.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-semibold text-xs text-zinc-950">
                    {formatPrice(ord.grandTotal)}
                  </span>
                  <Link
                    href={`/account/orders/${ord.id}`}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
