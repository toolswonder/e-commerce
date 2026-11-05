"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    shippingTotal,
    grandTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) {
      setCouponInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Your Cart</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-zinc-50 px-6 py-3 border-b border-zinc-100">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-zinc-600 mb-2">
                Add <span className="font-semibold text-zinc-900">{formatPrice(remainingForFreeShipping)}</span> more to unlock <span className="font-semibold text-amber-700">Free Worldwide Shipping</span>
              </p>
            ) : (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mb-2">
                <Check className="w-3.5 h-3.5" /> Congratulations! You unlocked Free Shipping.
              </p>
            )}
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-medium text-zinc-900 mb-1">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Explore our curated collection of artisanal furniture, atmospheric lighting, and stoneware.
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs px-6"
                >
                  Start Exploring
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-zinc-900 truncate">
                      {item.title}
                    </h4>
                    {item.variantTitle && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">
                        {item.variantTitle}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-zinc-900 mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="p-1 hover:bg-zinc-50 text-zinc-500 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold px-2.5 text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="p-1 hover:bg-zinc-50 text-zinc-500 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer summary & CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 space-y-4">
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. WELCOME10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-md border border-zinc-200 bg-white placeholder:text-zinc-400 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <Button type="submit" variant="outline" size="sm" className="text-xs px-3">
                  Apply
                </Button>
              </form>

              {couponMsg && (
                <p className={`text-xs ${couponMsg.error ? "text-red-600" : "text-emerald-700"}`}>
                  {couponMsg.text}
                </p>
              )}

              {couponCode && (
                <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 px-3 py-1.5 rounded-md border border-amber-200">
                  <span className="font-medium">Applied: {couponCode}</span>
                  <button
                    onClick={removeCoupon}
                    className="text-amber-700 hover:text-amber-900 underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-zinc-600 border-t border-zinc-200/60 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingTotal === 0 ? "Free" : formatPrice(shippingTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-zinc-900 border-t border-zinc-200/80 pt-2">
                  <span>Estimated Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-lg text-sm font-medium transition-all shadow hover:shadow-md"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  View Full Cart & Summary
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
