import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Compass } from "lucide-react";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { ProductCard } from "@/components/storefront/product-card";
import { getHomepageData } from "@/server/actions/product.actions";

export const revalidate = 60; // ISR cache for 60 seconds

export default async function HomePage() {
  const { categories, featuredProducts, newArrivals } = await getHomepageData();

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
              Disciplines &amp; Craft
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-medium text-zinc-700 hover:text-zinc-950 flex items-center gap-1 group"
          >
            Explore all disciplines{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-zinc-100 flex flex-col justify-end p-4 border border-zinc-100"
            >
              <Image
                src={cat.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="font-serif text-base sm:text-lg font-medium group-hover:text-amber-200 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-zinc-300">
                  {cat._count?.products || 4} Objects
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Curated Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-amber-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950">
              Curated Bestsellers
            </h2>
          </div>
          <Link
            href="/products?sort=featured"
            className="text-xs font-medium text-zinc-700 hover:text-zinc-950 flex items-center gap-1 group"
          >
            View all curated pieces{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              slug={product.slug}
              price={Number(product.price)}
              salePrice={product.salePrice ? Number(product.salePrice) : null}
              images={product.images}
              category={product.category}
              stock={product.stock}
              isFeatured={product.isFeatured}
              sku={product.sku}
            />
          ))}
        </div>
      </section>

      {/* 4. Promotional Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-zinc-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center min-h-[420px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1600&q=80"
              alt="Handcrafted ceramics ritual"
              fill
              className="object-cover brightness-[0.45]"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-medium tracking-widest uppercase text-amber-300">
              Artisan Feature
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light leading-snug">
              The Ritual of High-Fired Stoneware
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              Every teapot, bowl, and pour-over dripper in our ceramic series is hand-thrown on the potter&apos;s wheel using mineral-rich clays and natural ash glazes.
            </p>
            <div className="pt-2">
              <Link
                href="/categories/ceramics-dining"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 text-xs font-semibold tracking-wider uppercase hover:bg-amber-100 transition-colors shadow-lg"
              >
                Explore Stoneware Series <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
              Just Arrived
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950 mt-1">
              New Additions to the Sanctuary
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-xs font-medium text-zinc-700 hover:text-zinc-950 flex items-center gap-1 group"
          >
            Browse all new arrivals{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              slug={product.slug}
              price={Number(product.price)}
              salePrice={product.salePrice ? Number(product.salePrice) : null}
              images={product.images}
              category={product.category}
              stock={product.stock}
              isFeatured={product.isFeatured}
              sku={product.sku}
            />
          ))}
        </div>
      </section>

      {/* 6. Philosophy / Atelier Note */}
      <section className="bg-zinc-50 py-16 border-y border-zinc-100">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <Compass className="w-6 h-6 mx-auto text-amber-700" />
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-zinc-950">
            Designed for Domestic Tranquility
          </h2>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">
            &ldquo;In a world of ephemeral consumption, we champion enduring materiality: solid FSC certified timbers, tactile Belgian linens, and raw unlacquered brass that gently gains character alongside you.&rdquo;
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="text-xs font-medium uppercase tracking-wider text-zinc-950 hover:text-amber-800 underline underline-offset-4"
            >
              Read Our Atelier Manifesto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
