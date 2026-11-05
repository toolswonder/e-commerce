"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProductAction } from "@/server/actions/admin.actions";
import { useToast } from "@/components/ui/toast";

interface Category {
  id: string;
  name: string;
}

export function ProductCreateForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: categories[0]?.id || "",
    sku: "",
    price: "",
    salePrice: "",
    stock: "10",
    shortDescription: "",
    description: "",
    isFeatured: false,
  });

  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [variants, setVariants] = useState<
    { title: string; sku: string; price: string; stock: string }[]
  >([]);

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        title: "",
        sku: `${formData.sku || "SKU"}-${prev.length + 1}`,
        price: formData.price || "0",
        stock: "5",
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.sku || !formData.price || !formData.categoryId) {
      toast({ title: "Please fill in all required fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await createProductAction({
        title: formData.title,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        sku: formData.sku.toUpperCase().trim(),
        stock: parseInt(formData.stock, 10) || 0,
        shortDescription: formData.shortDescription,
        description: formData.description,
        isFeatured: formData.isFeatured,
        images,
        variants: variants.map((v) => ({
          title: v.title,
          sku: v.sku.toUpperCase().trim(),
          price: v.price ? parseFloat(v.price) : null,
          stock: parseInt(v.stock, 10) || 0,
        })),
      });

      if (res?.success) {
        toast({
          title: "Product Published",
          description: `${formData.title} is now active in your collection.`,
          type: "success",
        });
        router.push("/admin/products");
      }
    } catch {
      toast({ title: "Failed to publish product", type: "error" });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm">
      {/* Basic Attributes */}
      <div className="space-y-4">
        <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
          General Attributes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Object Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kyoto Solid White Oak Coffee Table"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Discipline / Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              SKU (Stock Keeping Unit) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FUR-KYO-009"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
          Financials &amp; Stock
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Regular Price ($ USD) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="480.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Promotional Sale Price ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="420.00 (Optional)"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Current Stock Units *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 pt-2 text-xs text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4"
          />
          <span className="font-medium">Highlight as Curated Bestseller on Homepage</span>
        </label>
      </div>

      {/* Descriptions */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
          Editorial &amp; Notes
        </h3>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Short Subtitle
          </label>
          <input
            type="text"
            placeholder="e.g. Sculptural low table with rounded chamfered joinery."
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Detailed Narrative &amp; Material Specifications
          </label>
          <textarea
            rows={5}
            required
            placeholder="Handcrafted from solid white oak..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
          />
        </div>
      </div>

      {/* Product Images */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
          Visual Assets (Image URLs)
        </h3>

        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          <Button
            type="button"
            onClick={handleAddImage}
            variant="outline"
            className="text-xs"
          >
            + Add URL
          </Button>
        </div>

        {/* Thumbnails preview */}
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-20 h-24 rounded-lg overflow-hidden border border-zinc-200 group"
            >
              <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 px-1 rounded bg-zinc-900/80 text-white text-[9px]">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Variants Builder */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h3 className="font-serif text-base font-medium text-zinc-950">
            Variants &amp; Editions (Optional)
          </h3>
          <Button
            type="button"
            onClick={handleAddVariant}
            variant="outline"
            size="sm"
            className="text-xs gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Variant
          </Button>
        </div>

        {variants.length > 0 && (
          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-zinc-50 p-3 rounded-lg border border-zinc-200"
              >
                <input
                  type="text"
                  placeholder="Edition Title (e.g. Matte Black / Large)"
                  value={v.title}
                  onChange={(e) => {
                    const u = [...variants];
                    u[idx].title = e.target.value;
                    setVariants(u);
                  }}
                  className="px-2 py-1 text-xs border rounded bg-white"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={v.sku}
                  onChange={(e) => {
                    const u = [...variants];
                    u[idx].sku = e.target.value;
                    setVariants(u);
                  }}
                  className="px-2 py-1 text-xs border rounded bg-white font-mono"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) => {
                    const u = [...variants];
                    u[idx].price = e.target.value;
                    setVariants(u);
                  }}
                  className="px-2 py-1 text-xs border rounded bg-white"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => {
                      const u = [...variants];
                      u[idx].stock = e.target.value;
                      setVariants(u);
                    }}
                    className="w-20 px-2 py-1 text-xs border rounded bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-1 text-zinc-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider gap-2 shadow"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Publishing to Catalog...
          </>
        ) : (
          <>
            Publish Object to Catalog <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}
