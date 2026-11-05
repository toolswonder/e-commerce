import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Layers, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CategoryCreateModal } from "./category-create-modal";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
        parent: true,
        children: true,
      },
    });
  } catch (err) {
    console.warn("DB query failed in AdminCategoriesPage, falling back to catalog:", err);
    const { MOCK_CATEGORIES } = await import("@/lib/mock-data");
    categories = MOCK_CATEGORIES;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-zinc-950">
            Disciplines &amp; Categories
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">
            Organize catalog taxonomy, nested subcategories, and storefront visual banners.
          </p>
        </div>

        <CategoryCreateModal parentCategories={categories} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-zinc-100">
              <Image
                src={cat.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
                alt={cat.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-900/80 text-white backdrop-blur-sm">
                {cat._count.products} Products
              </span>
            </div>

            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-zinc-950">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">/{cat.slug}</span>
                </div>
                {cat.description && (
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 font-light">
                    {cat.description}
                  </p>
                )}
                {cat.parent && (
                  <p className="text-[11px] text-amber-800 font-medium mt-2">
                    Child of: {cat.parent.name}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs">
                <span className="text-zinc-400">Sort priority: {cat.sortOrder}</span>
                <Link
                  href={`/categories/${cat.slug}`}
                  target="_blank"
                  className="font-medium text-zinc-900 hover:text-amber-800 inline-flex items-center gap-1"
                >
                  View on Storefront <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
