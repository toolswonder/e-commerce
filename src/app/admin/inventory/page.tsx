import React from "react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Warehouse, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ProductRowActions } from "../products/product-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { stock: "asc" },
      include: {
        category: true,
        variants: true,
      },
    });
  } catch (err) {
    console.warn("DB query failed in AdminInventoryPage, falling back to mock products:", err);
    const { MOCK_PRODUCTS } = await import("@/lib/mock-data");
    products = MOCK_PRODUCTS;
  }

  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-zinc-950">
            Inventory &amp; Replenishment
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">
            Real-time workshop stock levels, batch threshold alerts, and inline inventory adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>{lowStockCount} items below threshold (≤5)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Piece</th>
              <th className="p-3.5">SKU</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Unit Price</th>
              <th className="p-3.5 text-center">Available Units</th>
              <th className="p-3.5">Inventory Status</th>
              <th className="p-3.5 text-right">Quick Edit Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="p-3.5 font-medium text-zinc-950">{p.title}</td>
                <td className="p-3.5 font-mono text-zinc-500">{p.sku}</td>
                <td className="p-3.5 text-zinc-600">{p.category.name}</td>
                <td className="p-3.5 font-semibold text-zinc-950">{formatPrice(p.salePrice || p.price)}</td>
                <td className="p-3.5 text-center font-mono font-bold text-zinc-950">
                  {p.stock}
                </td>
                <td className="p-3.5">
                  {p.stock > 5 ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Level
                    </span>
                  ) : p.stock > 0 ? (
                    <span className="text-amber-800 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Low Stock
                    </span>
                  ) : (
                    <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                      Depleted (Out of Stock)
                    </span>
                  )}
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
  );
}
