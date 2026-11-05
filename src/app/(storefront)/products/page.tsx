import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductFilters } from "@/components/storefront/product-filters";
import { getProducts } from "@/server/actions/product.actions";
import { ChevronLeft, ChevronRight, PackageX } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: "featured" | "newest" | "price-asc" | "price-desc";
    search?: string;
    inStock?: string;
    page?: string;
  }>;
}

export const revalidate = 60;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;
  const inStock = resolvedParams.inStock === "true";

  const { products, totalCount, totalPages, currentPage } = await getProducts({
    category: resolvedParams.category,
    minPrice,
    maxPrice,
    sort: resolvedParams.sort,
    search: resolvedParams.search,
    inStock,
    page,
    limit: 12,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header & Breadcrumbs */}
      <div className="space-y-2 border-b border-zinc-100 pb-6">
        <nav className="text-xs text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">All Objects</span>
          {resolvedParams.category && (
            <>
              <span>/</span>
              <span className="text-amber-800 font-medium capitalize">
                {resolvedParams.category.replace("-", " ")}
              </span>
            </>
          )}
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-serif text-3xl font-light text-zinc-950">
            {resolvedParams.category
              ? resolvedParams.category
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
              : "Curated Living Collection"}
          </h1>
          <p className="text-xs text-zinc-500">
            Showing <span className="font-medium text-zinc-900">{products.length}</span> of{" "}
            <span className="font-medium text-zinc-900">{totalCount}</span> artisanal objects
          </p>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Column: Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
            <ProductFilters />
          </div>
        </div>

        {/* Right Column: Products Grid */}
        <div className="lg:col-span-3 space-y-10">
          {products.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-zinc-50 rounded-2xl border border-zinc-100 p-8">
              <PackageX className="w-12 h-12 mx-auto text-zinc-400 stroke-1" />
              <h3 className="font-serif text-lg text-zinc-900">No objects match your criteria</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try widening your price range or clearing active discipline filters.
              </p>
              <Link
                href="/products"
                className="inline-block mt-2 text-xs font-semibold uppercase tracking-wider text-amber-700 hover:text-amber-900 underline"
              >
                Clear All Filters
              </Link>
            </div>
          ) : (
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
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-zinc-100">
              {currentPage > 1 ? (
                <Link
                  href={`/products?page=${currentPage - 1}${
                    resolvedParams.category ? `&category=${resolvedParams.category}` : ""
                  }`}
                  className="p-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <span className="p-2 rounded-lg border border-zinc-100 text-zinc-300 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </span>
              )}

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={`/products?page=${pageNum}${
                      resolvedParams.category ? `&category=${resolvedParams.category}` : ""
                    }`}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      isCurrent
                        ? "bg-zinc-950 text-white"
                        : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {currentPage < totalPages ? (
                <Link
                  href={`/products?page=${currentPage + 1}${
                    resolvedParams.category ? `&category=${resolvedParams.category}` : ""
                  }`}
                  className="p-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="p-2 rounded-lg border border-zinc-100 text-zinc-300 cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
