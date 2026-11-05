"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  TicketPercent,
  Warehouse,
  Image as ImageIcon,
  Star,
  Settings,
  History,
  Store,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { label: "Banners & Content", href: "/admin/banners", icon: ImageIcon },
  { label: "Reviews Moderation", href: "/admin/reviews", icon: Star },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-300 border-r border-zinc-900 justify-between">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-serif tracking-[0.25em] text-xl font-bold text-white">
              AURA
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Link to Storefront */}
        <div className="px-4 py-3 border-b border-zinc-900">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Open Public Storefront ↗</span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 text-xs">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium",
                  isActive
                    ? "bg-amber-600 text-white font-semibold shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-900 text-[11px] text-zinc-500">
        AURA Engine v2.4 (Production)
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-zinc-950 text-white shadow-lg"
          aria-label="Open admin sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-64 max-w-xs h-full z-10">
              {navContent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
