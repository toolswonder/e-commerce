import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductFilters } from "@/components/storefront/product-filters";
import { getProducts } from "@/server/actions/product.actions";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    sort?: "featured" | "newest" | "price-asc" | "price-desc";
    page?: string;
  }>;
}

export const revalidate = 60;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  let category: { name: string; slug: string; description: string | null; image: string | null } | null = null;
  try {
    category = await prisma.category.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn("Failed to fetch category from DB, checking fallback catalog:", err);
  }

  if (!category) {
    const staticCategories: Record<string, { name: string; description: string; image: string }> = {
      furniture: {
        name: "Furniture",
        description: "Sculptural forms crafted from certified solid hardwoods and honed natural stone.",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80",
      },
      lighting: {
        name: "Lighting",
        description: "Atmospheric ambient luminescence, brushed metals, and blown glass statement pendants.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1600&q=80",
      },
      ceramics: {
        name: "Ceramics & Vases",
        description: "Small-batch studio ceramics celebrating intentional wabi-sabi irregularities.",
        image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1600&q=80",
      },
      textiles: {
        name: "Textiles & Rugs",
        description: "Raw slub linens, undyed organic wools, and hand-loomed heritage throws.",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1600&q=80",
      },
      decor: {
        name: "Home Decor",
        description: "Considered brass accessories, travertine incense burners, and architectural objects.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
      },
    };

    if (staticCategories[slug]) {
      category = {
        name: staticCategories[slug].name,
        slug,
        description: staticCategories[slug].description,
        image: staticCategories[slug].image,
      };
    }
  }

  if (!category) {
    notFound();
  }

  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const minPrice = resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined;

  const { products, totalCount } = await getProducts({
    category: slug,
    minPrice,
    maxPrice,
    sort: resolvedSearchParams.sort,
    page,
    limit: 16,
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Category Hero Banner */}
      <div className="relative bg-zinc-950 text-white min-h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={category.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80"}
            alt={category.name}
            fill
            priority
            className="object-cover brightness-[0.4]"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3">
          <nav className="text-xs text-zinc-300 flex items-center justify-center gap-1.5 uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-amber-300 font-medium">{category.name}</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <ProductFilters />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between text-xs text-zinc-500 pb-4 border-b border-zinc-100">
              <span>{totalCount} objects available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  slug={product.slug}
                  price={product.price}
                  salePrice={product.salePrice}
                  images={product.images}
                  category={product.category}
                  stock={product.stock}
                  isFeatured={product.isFeatured}
                  averageRating={product.averageRating}
                  reviewCount={product.reviewCount}
                  sku={product.sku}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
