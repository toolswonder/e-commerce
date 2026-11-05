"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface CategoryOption {
  name: string;
  slug: string;
}

const CATEGORIES: CategoryOption[] = [
  { name: "All Objects", slug: "" },
  { name: "Furniture", slug: "furniture" },
  { name: "Lighting", slug: "lighting" },
  { name: "Ceramics & Dining", slug: "ceramics-dining" },
  { name: "Textiles & Rugs", slug: "textiles-rugs" },
  { name: "Home Decor", slug: "home-decor" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under $100", min: undefined, max: 100 },
  { label: "$100 to $250", min: 100, max: 250 },
  { label: "$250 to $500", min: 250, max: 500 },
  { label: "$500 & Above", min: 500, max: undefined },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentInStock = searchParams.get("inStock") === "true";
  const currentSort = searchParams.get("sort") || "featured";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // reset pagination
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceSelect = (min?: number, max?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min !== undefined) params.set("minPrice", min.toString());
    else params.delete("minPrice");

    if (max !== undefined) params.set("maxPrice", max.toString());
    else params.delete("maxPrice");

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters =
    Boolean(currentCategory) ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice) ||
    currentInStock ||
    Boolean(searchParams.get("search"));

  return (
    <aside className="w-full space-y-8">
      {/* Filters Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
          <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-medium"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
          Category
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParam("category", cat.slug || null)}
              className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-between ${
                currentCategory === cat.slug
                  ? "bg-zinc-900 text-white font-medium"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
          Price Range
        </h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, idx) => {
            const isSelected =
              (range.min?.toString() || null) === currentMinPrice &&
              (range.max?.toString() || null) === currentMaxPrice;

            return (
              <button
                key={idx}
                onClick={() => handlePriceSelect(range.min, range.max)}
                className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors ${
                  isSelected
                    ? "bg-zinc-900 text-white font-medium"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="space-y-3 pt-2 border-t border-zinc-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
          Availability
        </h4>
        <label className="flex items-center gap-2.5 text-xs text-zinc-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
            className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Sort Options */}
      <div className="space-y-3 pt-2 border-t border-zinc-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
          Sort Order
        </h4>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        >
          <option value="featured">Featured / Curated</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
}
