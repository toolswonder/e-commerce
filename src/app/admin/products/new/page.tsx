import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { ProductCreateForm } from "./product-create-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-200">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-zinc-200/60 text-zinc-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-light text-zinc-950">
            Create New Sanctuary Object
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-0.5">
            Add a newly crafted piece to the catalog with variants, high-res images, and pricing.
          </p>
        </div>
      </div>

      <ProductCreateForm categories={categories} />
    </div>
  );
}
