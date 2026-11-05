"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  Shield,
  Package,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { SearchModal } from "./search-modal";

export function Header() {
  const { data: session } = useSession();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistIds } = useWishlist();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categories = [
    { name: "Furniture", href: "/categories/furniture" },
    { name: "Lighting", href: "/categories/lighting" },
    { name: "Ceramics & Dining", href: "/categories/ceramics-dining" },
    { name: "Textiles & Rugs", href: "/categories/textiles-rugs" },
    { name: "Home Decor", href: "/categories/home-decor" },
  ];

  return (
    <>
      {/* Top promotional strip */}
      <div className="bg-zinc-900 text-zinc-300 text-xs py-2 px-4 text-center tracking-wide font-normal">
        Complimentary carbon-neutral worldwide shipping on orders above $150 · Use code{" "}
        <span className="font-semibold text-white tracking-widest bg-zinc-800 px-2 py-0.5 rounded">
          WELCOME10
        </span>{" "}
        for 10% off
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-zinc-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-950"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-serif tracking-[0.25em] text-2xl font-bold text-zinc-950 group-hover:text-amber-800 transition-colors">
                AURA
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase text-zinc-400 font-sans border-l border-zinc-300 pl-2">
                Living
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-wide uppercase text-zinc-600">
              <Link href="/products" className="hover:text-zinc-950 transition-colors">
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="hover:text-zinc-950 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/80 hover:bg-zinc-200/80 text-zinc-500 text-xs transition-colors"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-zinc-700" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[10px] bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-500 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-zinc-700 hover:text-zinc-950 transition-colors"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-700 hover:text-zinc-950 transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-zinc-950 text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            <div className="relative">
              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-zinc-100 transition-colors text-xs font-medium text-zinc-800"
                  >
                    <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold text-xs uppercase">
                      {session.user.name?.[0] || "U"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  {/* Dropdown popup */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-100 py-2 z-50 text-xs animate-in fade-in-50 zoom-in-95"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-zinc-100">
                        <p className="font-semibold text-zinc-900 truncate">{session.user.name}</p>
                        <p className="text-zinc-500 truncate text-[11px]">{session.user.email}</p>
                      </div>

                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-amber-800 hover:bg-amber-50 font-medium"
                        >
                          <Shield className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/account"
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50"
                      >
                        <User className="w-4 h-4 text-zinc-400" /> Profile Overview
                      </Link>

                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50"
                      >
                        <Package className="w-4 h-4 text-zinc-400" /> My Orders & Tracking
                      </Link>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left border-t border-zinc-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 p-2"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-100 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-zinc-900 hover:text-amber-800"
            >
              Shop All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm text-zinc-600 hover:text-zinc-900"
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2 text-xs">
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-500 hover:text-zinc-900"
              >
                About Our Atelier
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-500 hover:text-zinc-900"
              >
                Frequently Asked Questions
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-500 hover:text-zinc-900"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
