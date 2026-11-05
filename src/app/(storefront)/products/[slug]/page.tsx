import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getProductBySlug } from "@/server/actions/product.actions";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { VariantSelector } from "@/components/storefront/variant-selector";
import { ReviewList } from "@/components/storefront/review-list";
import { ProductCard } from "@/components/storefront/product-card";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.seoTitle || `${product.title} | AURA Living`,
    description: product.seoDescription || product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [
        {
          url: product.images[0]?.url || "",
          width: 800,
          height: 1000,
          alt: product.title,
        },
      ],
    },
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Schema.org Product structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.shortDescription || product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "AURA Living",
    },
    offers: {
      "@type": "Offer",
      url: `https://auraliving.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.salePrice || product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.averageRating || 5.0,
      reviewCount: product.reviewCount || 1,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Trail */}
      <nav className="text-xs text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-zinc-900 transition-colors">
          Objects
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-zinc-900 transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-zinc-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column: Image Gallery with Zoom */}
        <ProductGallery images={product.images} title={product.title} />

        {/* Right Column: Details, Variants & Actions */}
        <div className="space-y-8">
          <div>
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs font-semibold tracking-widest uppercase text-amber-700 hover:text-amber-900 transition-colors"
            >
              {product.category.name}
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950 mt-1 leading-tight">
              {product.title}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              SKU: {product.sku}
            </p>
          </div>

          {/* Variant Selector + Pricing + Add to Cart */}
          <VariantSelector
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              salePrice: product.salePrice,
              stock: product.stock,
              sku: product.sku,
              images: product.images,
            }}
            variants={product.variants.map((v) => ({
              ...v,
              price: v.price ? Number(v.price) : null,
            }))}
          />

          {/* Description & Materiality */}
          <div className="space-y-4 pt-6 border-t border-zinc-100">
            <h3 className="font-serif text-base font-medium text-zinc-950">
              Artisan Notes &amp; Specifications
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewList
        productId={product.id}
        productTitle={product.title}
        reviews={product.reviews as any}
        averageRating={product.averageRating}
      />

      {/* Related Products Section */}
      {product.related && product.related.length > 0 && (
        <section className="space-y-8 pt-10 border-t border-zinc-100">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-2xl font-light text-zinc-950">
              Complementary Works
            </h3>
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs font-medium text-zinc-700 hover:text-zinc-950 underline"
            >
              View More in {product.category.name}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.related.map((rel) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                title={rel.title}
                slug={rel.slug}
                price={rel.price}
                salePrice={rel.salePrice}
                images={rel.images}
                category={rel.category}
                stock={rel.stock}
                sku={rel.sku}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
