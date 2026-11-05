import React from "react";
import Link from "next/link";
import { Truck, RotateCcw, PackageCheck, Globe2 } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns Policy",
  description: "Worldwide carbon-neutral shipping rates, transit timelines, and 30-day sanctuary returns.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
          Global Logistics
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950">
          Shipping &amp; Returns
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 font-light max-w-md mx-auto">
          We ensure each object travels with utmost protection and carbon-neutral packaging directly to your doorstep.
        </p>
      </div>

      <div className="space-y-10 text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
        {/* Shipping Rates */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-950 font-serif text-xl font-medium">
            <Truck className="w-5 h-5 text-amber-800" />
            <h2>Shipping Rates &amp; Timelines</h2>
          </div>
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Tier</th>
                  <th className="p-3.5">Order Value</th>
                  <th className="p-3.5">Cost</th>
                  <th className="p-3.5">Estimated Transit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3.5 font-medium text-zinc-900">Standard Insured</td>
                  <td className="p-3.5">$150.00 &amp; Above</td>
                  <td className="p-3.5 font-semibold text-emerald-700">FREE</td>
                  <td className="p-3.5">3–5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-zinc-900">Standard Insured</td>
                  <td className="p-3.5">Under $150.00</td>
                  <td className="p-3.5">$15.00 Flat Rate</td>
                  <td className="p-3.5">3–5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-zinc-900">Freight &amp; White Glove</td>
                  <td className="p-3.5">Large Solid Furniture</td>
                  <td className="p-3.5">Complimentary</td>
                  <td className="p-3.5">7–12 Business Days (Appointment)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Returns */}
        <section id="returns" className="space-y-4 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-950 font-serif text-xl font-medium">
            <RotateCcw className="w-5 h-5 text-amber-800" />
            <h2>30-Day Sanctuary Returns</h2>
          </div>
          <p>
            An object must live with you to know if it belongs. If you feel any piece is not right for your space within 30 days of delivery, contact concierge@auraliving.com with your order number. We will arrange a prepaid pickup label and refund the full purchase amount to your original payment method.
          </p>
        </section>

        {/* Packaging */}
        <section className="space-y-4 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-950 font-serif text-xl font-medium">
            <PackageCheck className="w-5 h-5 text-amber-800" />
            <h2>Zero Plastic Sustainable Packaging</h2>
          </div>
          <p>
            All ceramics, lighting, and textiles are nestled in 100% post-consumer molded pulp, unbleached kraft paper, and biodegradable water-activated tape.
          </p>
        </section>
      </div>
    </div>
  );
}
