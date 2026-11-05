"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    shippingTotal,
    taxTotal,
    grandTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h1 className="font-serif text-3xl font-light text-zinc-950">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto font-light">
          You haven&apos;t added any items to your sanctuary order yet. Explore our curated collections of furniture, ceramics, and textiles.
        </p>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow"
          >
            Explore Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4 flex items-baseline justify-between">
        <h1 className="font-serif text-3xl font-light text-zinc-950">
          Your Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-600 transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-xs text-zinc-700">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <span className="font-semibold text-zinc-950">{formatPrice(remainingForFreeShipping)}</span> more to unlock <span className="text-amber-800 font-semibold">Free Insured Shipping</span>
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Free Worldwide Shipping Unlocked!
                </span>
              )}
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="divide-y divide-zinc-100 border-y border-zinc-100">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex gap-6 items-center">
                <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif text-base font-medium text-zinc-950 truncate">
                    {item.title}
                  </h3>
                  {item.variantTitle && (
                    <p className="text-xs text-zinc-500">Edition: {item.variantTitle}</p>
                  )}
                  <p className="text-xs text-zinc-400 font-mono">SKU: {item.sku}</p>
                  <p className="text-sm font-semibold text-zinc-950 pt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-zinc-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                    className="p-2 text-zinc-500 hover:text-zinc-950 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-zinc-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                    className="p-2 text-zinc-500 hover:text-zinc-950 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for line item */}
                <div className="text-right min-w-[5rem]">
                  <p className="text-sm font-semibold text-zinc-950">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-xs text-zinc-400 hover:text-red-600 transition-colors mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/80 space-y-6 sticky top-28">
            <h2 className="font-serif text-lg font-medium text-zinc-950">
              Order Summary
            </h2>

            {/* Coupon Code Input */}
            <form onSubmit={handleApply} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white placeholder:text-zinc-400 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <Button type="submit" variant="outline" size="sm" className="text-xs">
                Apply
              </Button>
            </form>

            {couponMsg && (
              <p className={`text-xs ${couponMsg.error ? "text-red-600" : "text-emerald-700"}`}>
                {couponMsg.text}
              </p>
            )}

            {couponCode && (
              <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 px-3 py-2 rounded-lg border border-amber-200">
                <span className="font-medium">Active: {couponCode}</span>
                <button
                  onClick={removeCoupon}
                  className="text-amber-800 hover:text-amber-950 underline font-medium"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-zinc-600 border-t border-zinc-200 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingTotal === 0 ? "Free" : formatPrice(shippingTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8.5%)</span>
                <span>{formatPrice(taxTotal)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-zinc-950 border-t border-zinc-200 pt-3">
                <span>Estimated Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-lg"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-center flex items-center justify-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted &amp; Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
