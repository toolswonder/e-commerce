import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Plus, Download, Edit, Trash2, Search, AlertCircle } from "lucide-react";
import { ProductRowActions } from "./product-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const res = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          variants: true,
        },
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    products = res[0];
    categories = res[1];
  } catch (err) {
    console.warn("DB query failed in AdminProductsPage, falling back to catalog:", err);
    const { MOCK_PRODUCTS, MOCK_CATEGORIES } = await import("@/lib/mock-data");
    products = MOCK_PRODUCTS;
    categories = MOCK_CATEGORIES;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-zinc-950">
            Product Catalog
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">
            Manage your inventory, editions, pricing, and merchandising status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/export/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </a>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Object
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-500">
            {products.length} products listed
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Piece</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5">Merchandising</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                        <Image
                          src={p.images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80"}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="font-medium text-zinc-900 hover:text-amber-800 transition-colors truncate block"
                        >
                          {p.title}
                        </Link>
                        {p.variants.length > 0 && (
                          <span className="text-[10px] text-zinc-400">
                            {p.variants.length} variant(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-zinc-600">{p.category.name}</td>
                  <td className="p-3.5 font-mono text-zinc-500">{p.sku}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-zinc-900">
                      {formatPrice(p.salePrice || p.price)}
                    </span>
                    {p.salePrice && (
                      <span className="block text-[10px] text-zinc-400 line-through">
                        {formatPrice(p.price)}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {p.stock > 5 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        {p.stock} In Stock
                      </span>
                    ) : p.stock > 0 ? (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit">
                        <AlertCircle className="w-3 h-3 text-amber-600" /> Only {p.stock} Left
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                        Sold Out
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        p.status === "PUBLISHED"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <ProductRowActions productId={p.id} currentStock={p.stock} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
