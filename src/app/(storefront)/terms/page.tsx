import React from "react";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions of service for AURA Living patrons.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
      <div className="border-b border-zinc-100 pb-6">
        <h1 className="font-serif text-3xl font-light text-zinc-950">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Effective: Spring 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-serif text-lg font-medium text-zinc-900">1. Acceptance of Terms</h2>
        <p>
          By accessing the AURA Living website and placing an order for goods, you agree to be bound by these Terms of Service, applicable laws, and regulations.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif text-lg font-medium text-zinc-900">2. Product Authenticity &amp; Handcraft Variance</h2>
        <p>
          Because our collections comprise hand-thrown stoneware ceramics and natural solid timbers (oak, walnut, ash), natural variations in grain, subtle texture shifts, and glaze nuances are intentional characteristics of authentic craft and not manufacturing defects.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif text-lg font-medium text-zinc-900">3. Orders &amp; Price Integrity</h2>
        <p>
          All prices are quoted in USD unless otherwise specified. We reserve the right to cancel orders arising from typographical or technical pricing discrepancies, with immediate full reimbursement to the customer.
        </p>
      </section>
    </div>
  );
}
