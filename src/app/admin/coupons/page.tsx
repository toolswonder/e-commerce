import React from "react";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { TicketPercent, Trash2, CheckCircle2 } from "lucide-react";
import { CouponCreateForm } from "./coupon-create-form";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  let coupons: any[] = [];
  try {
    coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("DB query failed in AdminCouponsPage, falling back to mock coupons:", err);
    coupons = [
      { id: "c1", code: "WELCOME10", description: "10% off for first-time patrons", discountType: "PERCENTAGE", discountValue: 10, minOrderValue: null, usageCount: 14, isActive: true },
      { id: "c2", code: "SAVE50", description: "$50 off architectural orders above $250", discountType: "FIXED", discountValue: 50, minOrderValue: 250, usageCount: 6, isActive: true },
      { id: "c3", code: "AURA2026", description: "15% off return patron seasonal gift", discountType: "PERCENTAGE", discountValue: 15, minOrderValue: null, usageCount: 22, isActive: true },
    ];
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="font-serif text-3xl font-light text-zinc-950">
          Promotional Coupons &amp; Campaigns
        </h1>
        <p className="text-xs text-zinc-500 font-light mt-1">
          Issue percentage or fixed savings codes, define minimum order thresholds, and track redemptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Coupon Form */}
        <div className="lg:col-span-5">
          <CouponCreateForm />
        </div>

        {/* Right Column: Existing Coupons Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
          <div className="p-4 bg-zinc-50 border-b border-zinc-100">
            <h3 className="font-serif text-base font-medium text-zinc-950">
              Active Campaign Codes
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Benefit</th>
                <th className="p-3.5">Min Order</th>
                <th className="p-3.5 text-center">Redeemed</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {coupons.map((coup) => (
                <tr key={coup.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-zinc-950">
                    {coup.code}
                  </td>
                  <td className="p-3.5">
                    {coup.discountType === "PERCENTAGE"
                      ? `${coup.discountValue}% OFF`
                      : `${formatPrice(coup.discountValue)} OFF`}
                  </td>
                  <td className="p-3.5 text-zinc-600">
                    {coup.minOrderValue ? formatPrice(coup.minOrderValue) : "No minimum"}
                  </td>
                  <td className="p-3.5 text-center font-medium text-zinc-900">
                    {coup.usedCount} {coup.usageLimit ? `/ ${coup.usageLimit}` : ""}
                  </td>
                  <td className="p-3.5">
                    {coup.isActive ? (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                        Inactive
                      </span>
                    )}
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
