"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { useToast } from "@/components/ui/toast";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: { url: string; altText?: string | null }[];
  category: { name: string; slug: string };
  stock?: number;
  isFeatured?: boolean;
  averageRating?: number;
  reviewCount?: number;
  sku: string;
}

export function ProductCard({
  id,
  title,
  slug,
  price,
  salePrice,
  images,
  category,
  stock = 10,
  isFeatured = false,
  averageRating = 5.0,
  reviewCount = 0,
  sku,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(id);
  const primaryImg = images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";
  const hoverImg = images[1]?.url || primaryImg;

  const currentPrice = salePrice || price;
  const discountPercentage = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: id,
      title,
      price: currentPrice,
      image: primaryImg,
      quantity: 1,
      sku,
    });

    setAdded(true);
    toast({
      title: "Added to Cart",
      description: `${title} was added to your sanctuary cart.`,
      type: "success",
    });

    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist",
      description: title,
      type: "info",
    });
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-md transition-all duration-300">
      {/* Product Image Frame */}
      <Link href={`/products/${slug}`} className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
        <Image
          src={primaryImg}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover Secondary Image */}
        {images.length > 1 && (
          <Image
            src={hoverImg}
            alt={`${title} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {salePrice && (
            <span className="bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercentage}%
            </span>
          )}
          {isFeatured && !salePrice && (
            <span className="bg-zinc-900 text-white text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              Curated
            </span>
          )}
          {stock > 0 && stock <= 5 && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Only {stock} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white/80 backdrop-blur-sm text-zinc-600 hover:text-zinc-950 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Quick Add To Cart Floating Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={stock <= 0}
            className="w-full py-2.5 px-3 rounded-lg bg-white/95 backdrop-blur-md hover:bg-zinc-900 hover:text-white text-zinc-950 text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Added to Cart
              </>
            ) : stock <= 0 ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium tracking-wider uppercase text-zinc-400">
            {category.name}
          </p>
          <Link href={`/products/${slug}`}>
            <h3 className="font-serif text-sm font-medium text-zinc-900 hover:text-amber-800 transition-colors line-clamp-1 mt-0.5">
              {title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(averageRating)
                      ? "fill-amber-500"
                      : "text-zinc-200 fill-zinc-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-zinc-400">
              ({reviewCount > 0 ? reviewCount : 1})
            </span>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-sm font-semibold text-zinc-950">
            {formatPrice(currentPrice)}
          </span>
          {salePrice && (
            <span className="text-xs text-zinc-400 line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
