"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface Variant {
  id: string;
  title: string;
  sku: string;
  price?: number | null;
  stock: number;
  attributes: any;
}

interface VariantSelectorProps {
  product: {
    id: string;
    title: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    sku: string;
    images: { url: string }[];
  };
  variants: Variant[];
}

export function VariantSelector({ product, variants }: VariantSelectorProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const effectivePrice = selectedVariant?.price
    ? Number(selectedVariant.price)
    : product.salePrice || product.price;

  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = effectiveStock <= 0;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (redirectCheckout: boolean = false) => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      variantTitle: selectedVariant?.title,
      title: product.title,
      price: effectivePrice,
      image: product.images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      quantity,
      sku: selectedVariant?.sku || product.sku,
    });

    setAdded(true);
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.title}${selectedVariant ? ` (${selectedVariant.title})` : ""} added to cart.`,
      type: "success",
    });

    setTimeout(() => setAdded(false), 2000);

    if (redirectCheckout) {
      router.push("/checkout");
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl font-medium text-zinc-950">
          {formatPrice(effectivePrice)}
        </span>
        {product.salePrice && !selectedVariant?.price && (
          <span className="text-base text-zinc-400 line-through">
            {formatPrice(product.price)}
          </span>
        )}
        {product.salePrice && !selectedVariant?.price && (
          <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
            Save {formatPrice(product.price - product.salePrice)}
          </span>
        )}
      </div>

      {/* Variants Selection (if product has variants) */}
      {variants.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold uppercase tracking-wider text-zinc-900">
              Selection:
            </span>
            <span className="text-zinc-500 font-medium">
              {selectedVariant?.title}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-4 py-2 text-xs rounded-lg border transition-all text-left ${
                    isSelected
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-sm font-medium"
                      : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  {v.title}
                  {v.price && v.price !== product.price && (
                    <span className="ml-1.5 opacity-80 font-normal">
                      ({formatPrice(v.price)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Status Badge */}
      <div className="flex items-center gap-2 text-xs">
        {effectiveStock > 5 ? (
          <span className="text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> In Stock &amp; Ready to Ship
          </span>
        ) : effectiveStock > 0 ? (
          <span className="text-amber-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" /> Only {effectiveStock} units remaining
          </span>
        ) : (
          <span className="text-red-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" /> Currently Sold Out
          </span>
        )}
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-zinc-200 rounded-lg bg-white px-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-2 text-zinc-500 hover:text-zinc-900 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-xs font-semibold text-zinc-900 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
              disabled={quantity >= effectiveStock || isOutOfStock}
              className="p-2 text-zinc-500 hover:text-zinc-900 disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add To Cart */}
          <Button
            onClick={() => handleAddToCart(false)}
            disabled={isOutOfStock}
            className="flex-1 h-12 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider gap-2 shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            {added ? "Added to Cart!" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
              isWishlisted
                ? "border-amber-600 bg-amber-50 text-amber-600"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-amber-600" : ""}`} />
          </button>
        </div>

        {/* Buy Now instant checkout */}
        {!isOutOfStock && (
          <Button
            onClick={() => handleAddToCart(true)}
            variant="outline"
            className="w-full h-11 rounded-lg border-zinc-900 text-zinc-900 hover:bg-zinc-50 text-xs font-semibold uppercase tracking-wider"
          >
            Instant Buy Now
          </Button>
        )}
      </div>

      {/* Reassurance Features */}
      <div className="border-t border-zinc-100 pt-6 space-y-3 text-xs text-zinc-600">
        <div className="flex items-center gap-3">
          <Truck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Complimentary insured shipping on orders above $150</span>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
          <span>30-Day in-home trial &amp; white-glove returns</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>10-Year structural craftsmanship guarantee</span>
        </div>
      </div>
    </div>
  );
}
