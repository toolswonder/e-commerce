"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Check, X, Loader2 } from "lucide-react";
import { updateProductStockAction, deleteProductAction } from "@/server/actions/admin.actions";
import { useToast } from "@/components/ui/toast";

export function ProductRowActions({
  productId,
  currentStock,
}: {
  productId: string;
  currentStock: number;
}) {
  const { toast } = useToast();
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stock, setStock] = useState(currentStock);
  const [loading, setLoading] = useState(false);

  const handleSaveStock = async () => {
    setLoading(true);
    try {
      await updateProductStockAction(productId, stock);
      setIsEditingStock(false);
      toast({
        title: "Stock Updated",
        description: `Inventory level adjusted to ${stock} units.`,
        type: "success",
      });
    } catch {
      toast({ title: "Failed to update stock", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this piece from the catalog? This action will be recorded in audit logs.")) {
      return;
    }

    setLoading(true);
    try {
      await deleteProductAction(productId);
      toast({
        title: "Product Deleted",
        description: "The piece has been archived and removed from catalog.",
        type: "info",
      });
    } catch {
      toast({ title: "Failed to delete product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (isEditingStock) {
    return (
      <div className="flex items-center justify-end gap-1.5">
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
          className="w-16 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-zinc-900"
        />
        <button
          onClick={handleSaveStock}
          disabled={loading}
          className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setIsEditingStock(false)}
          className="p-1 rounded text-zinc-400 hover:bg-zinc-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => setIsEditingStock(true)}
        className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
        title="Adjust stock count"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded-md hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors"
        title="Delete product"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
