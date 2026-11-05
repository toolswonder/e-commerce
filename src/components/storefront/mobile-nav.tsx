"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistIds } = useWishlist();

  // Don't render on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around text-[10px] font-medium text-zinc-500">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 p-1 transition-colors",
            pathname === "/" ? "text-zinc-950 font-semibold" : "hover:text-zinc-900"
          )}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/products"
          className={cn(
            "flex flex-col items-center gap-1 p-1 transition-colors",
            pathname.startsWith("/products") || pathname.startsWith("/categories")
              ? "text-zinc-950 font-semibold"
              : "hover:text-zinc-900"
          )}
        >
          <Compass className="w-5 h-5" />
          <span>Catalog</span>
        </Link>

        <Link
          href="/account/wishlist"
          className={cn(
            "relative flex flex-col items-center gap-1 p-1 transition-colors",
            pathname === "/account/wishlist" ? "text-zinc-950 font-semibold" : "hover:text-zinc-900"
          )}
        >
          <Heart className="w-5 h-5" />
          {wishlistIds.length > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-amber-600 text-[9px] font-bold text-white flex items-center justify-center">
              {wishlistIds.length}
            </span>
          )}
          <span>Saved</span>
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1 hover:text-zinc-900 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-zinc-950 text-[9px] font-bold text-white flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span>Cart</span>
        </button>

        <Link
          href="/account"
          className={cn(
            "flex flex-col items-center gap-1 p-1 transition-colors",
            pathname.startsWith("/account") && pathname !== "/account/wishlist"
              ? "text-zinc-950 font-semibold"
              : "hover:text-zinc-900"
          )}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
}
