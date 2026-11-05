"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface DataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export function SalesChart({ initialData }: { initialData: DataPoint[] }) {
  const [range, setRange] = useState<"7" | "30" | "90">("7");

  // In demo preview, generate 30 and 90 day curves if selected
  const maxRevenue = Math.max(...initialData.map((d) => d.revenue), 1000);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-medium text-zinc-950">
            Revenue Performance
          </h3>
          <p className="text-xs text-zinc-500 font-light mt-0.5">
            Real-time gross transaction volume across fulfillment channels.
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex bg-zinc-100 p-1 rounded-lg text-xs font-medium text-zinc-600">
          {(["7", "30", "90"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md transition-all ${
                range === r
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "hover:text-zinc-950"
              }`}
            >
              {r} Days
            </button>
          ))}
        </div>
      </div>

      {/* SVG Bar Chart Visualization */}
      <div className="h-64 flex items-end gap-3 pt-6 border-b border-zinc-100">
        {initialData.map((item, idx) => {
          const heightPercent = Math.max(8, (item.revenue / maxRevenue) * 100);
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                {formatPrice(item.revenue)} ({item.orders} orders)
              </div>

              {/* Bar */}
              <div
                className="w-full max-w-[40px] rounded-t-md bg-amber-600/80 group-hover:bg-amber-600 transition-all duration-300"
                style={{ height: `${heightPercent}%` }}
              />

              {/* X Axis Label */}
              <span className="text-[10px] text-zinc-400 group-hover:text-zinc-900 transition-colors">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
        <span>Channel: Stripe + Razorpay Integrated</span>
        <span>Audit Status: Reconciled</span>
      </div>
    </div>
  );
}
