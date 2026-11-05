"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createCouponAction } from "@/server/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { Loader2, Plus } from "lucide-react";
import { DiscountType } from "@prisma/client";

export function CouponCreateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    setLoading(true);
    try {
      await createCouponAction({
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : undefined,
      });

      toast({
        title: "Coupon Activated",
        description: `Code ${code.toUpperCase()} is now live.`,
        type: "success",
      });

      setCode("");
      setDescription("");
      setDiscountValue("");
      setMinOrderValue("");
      setUsageLimit("");
      router.refresh();
    } catch {
      toast({ title: "Failed to create coupon", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-sm">
      <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
        Generate Promotional Code
      </h3>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
          Coupon Code *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. SANCTUARY20"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 uppercase font-mono font-bold"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
            Discount Type
          </label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as DiscountType)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white"
          >
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
            Value *
          </label>
          <input
            type="number"
            required
            step="0.01"
            placeholder={discountType === "PERCENTAGE" ? "15" : "50.00"}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
            Min Order ($)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="100.00"
            value={minOrderValue}
            onChange={(e) => setMinOrderValue(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
            Usage Limit
          </label>
          <input
            type="number"
            placeholder="500"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
          Internal Description
        </label>
        <input
          type="text"
          placeholder="Spring 2026 Patron welcome incentive"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full text-xs h-10 bg-zinc-900 hover:bg-zinc-800 text-white gap-2 shadow"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
        Create &amp; Publish Coupon
      </Button>
    </form>
  );
}
