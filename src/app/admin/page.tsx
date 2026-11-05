import React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
} from "lucide-react";
import { getAdminDashboardStats } from "@/server/actions/admin.actions";
import { formatPrice, formatDate } from "@/lib/utils";
import { SalesChart } from "@/components/admin/sales-chart";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-zinc-950">
            Atelier Overview
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">
            Real-time fulfillment metrics, sales velocity, and inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow"
          >
            + Create Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Fulfill Orders
          </Link>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Gross Revenue
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-zinc-950">
            {formatPrice(stats.totalRevenue)}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs previous period
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Fulfilled &amp; Active Orders
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-zinc-950">
            {stats.totalOrders}
          </p>
          <p className="text-[11px] text-zinc-500">
            100% On-time delivery rate
          </p>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Active Patrons
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-zinc-950">
            {stats.totalCustomers}
          </p>
          <p className="text-[11px] text-zinc-500">
            Registered customer accounts
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Low-Stock Warnings
            </span>
            <div className={`p-2 rounded-lg ${stats.lowStockCount > 0 ? "bg-rose-50 text-rose-700" : "bg-zinc-50 text-zinc-400"}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-medium text-zinc-950">
            {stats.lowStockCount}
          </p>
          <p className="text-[11px] text-zinc-500">
            {stats.lowStockCount > 0 ? "Needs reorder replenishment" : "Inventory healthy"}
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      <SalesChart initialData={stats.salesChartData} />

      {/* Two Column Layout: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-serif text-lg font-medium text-zinc-950">
              Recent Inquiries &amp; Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">
              No orders have been recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {stats.recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="font-mono font-bold text-zinc-950 hover:text-amber-800"
                      >
                        {ord.orderNumber}
                      </Link>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {ord.user?.name || "Guest Patron"} · {formatDate(ord.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-950">{formatPrice(ord.grandTotal)}</p>
                    <p className="text-[10px] text-zinc-400">{ord.items.length} item(s)</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-serif text-lg font-medium text-zinc-950">
              Featured Catalog Pieces
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              Manage Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {stats.topProducts.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-medium text-zinc-950 truncate">{p.title}</p>
                  <p className="text-[11px] text-zinc-400">{p.category.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-zinc-950">{formatPrice(p.salePrice || p.price)}</p>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      p.stock > 5 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.stock} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
