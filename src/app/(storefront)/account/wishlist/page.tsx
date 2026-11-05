"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  sku: string;
  stock: number;
  image: string;
  category: string;
}

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products/batch?ids=${wishlistIds.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlistIds]);

  const handleMoveToCart = (p: WishlistProduct) => {
    addItem({
      productId: p.id,
      title: p.title,
      price: p.salePrice || p.price,
      image: p.image,
      quantity: 1,
      sku: p.sku,
    });
    toggleWishlist(p.id);
    toast({
      title: "Moved to Cart",
      description: `${p.title} has been moved to your cart.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 pb-4 flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-zinc-950">
            Wishlist Sanctuary
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">
            Pieces curated for your future home environment.
          </p>
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          {wishlistIds.length} Saved Object{wishlistIds.length === 1 ? "" : "s"}
        </span>
      </div>

      {wishlistIds.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-zinc-50 rounded-2xl border border-zinc-100 p-8">
          <Heart className="w-10 h-10 mx-auto text-zinc-400 stroke-1" />
          <h3 className="font-serif text-base text-zinc-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Click the heart icon on any work in our collection to save it to your private sanctuary list.
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider"
          >
            Explore Objects
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-zinc-200/80 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/5] bg-zinc-100">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-zinc-700 hover:text-red-600 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                    {p.category}
                  </span>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-serif text-sm font-medium text-zinc-950 group-hover:text-amber-800 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-xs font-semibold text-zinc-950 mt-1">
                    {formatPrice(p.salePrice || p.price)}
                  </p>
                </div>

                <Button
                  onClick={() => handleMoveToCart(p)}
                  disabled={p.stock <= 0}
                  className="w-full text-xs h-9 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {p.stock > 0 ? "Move to Cart" : "Sold Out"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
