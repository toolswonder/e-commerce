"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { User, Package, MapPin, Heart, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: "Profile Overview", href: "/account", icon: User },
    { label: "My Orders & Tracking", href: "/account/orders", icon: Package },
    { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Wishlist Sanctuary", href: "/account/wishlist", icon: Heart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Account Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm uppercase">
              {session?.user?.name?.[0] || "P"}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-semibold text-zinc-900 truncate">
                {session?.user?.name || "Valued Patron"}
              </h2>
              <p className="text-[11px] text-zinc-500 truncate">{session?.user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-amber-900 bg-amber-50/80 hover:bg-amber-100 font-semibold mb-2 transition-colors"
              >
                <Shield className="w-4 h-4 text-amber-700" />
                <span>Admin Panel</span>
              </Link>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors font-medium",
                    isActive
                      ? "bg-zinc-900 text-white font-semibold"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-600 hover:bg-red-50 text-left font-medium transition-colors pt-4 border-t border-zinc-100 mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Pane */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
