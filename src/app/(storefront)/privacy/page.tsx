import React from "react";

export const metadata = {
  title: "Privacy Policy",
  description: "AURA Living privacy policy regarding data collection, encryption, and GDPR compliance.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
      <div className="border-b border-zinc-100 pb-6">
        <h1 className="font-serif text-3xl font-light text-zinc-950">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Last revised: Spring 2026</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-serif text-lg font-medium text-zinc-900">1. Information We Collect</h2>
        <p>
          We collect personal identification information including your name, email address, physical delivery address, and phone number when you place an order or create an account with AURA Living. Payment card information is tokenized directly through our PCI-DSS Level 1 compliant payment partners (Stripe and Razorpay) and is never stored on our servers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif text-lg font-medium text-zinc-900">2. How Your Information Is Used</h2>
        <p>
          Your information is utilized solely to process transactions, fulfill deliveries with carrier partners, communicate status updates, and provide personalized concierge support. We never sell, rent, or monetize your personal data with third-party advertising brokers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif text-lg font-medium text-zinc-900">3. Cookies &amp; Data Security</h2>
        <p>
          We use strictly necessary session cookies to maintain your shopping cart state and authenticated session securely. All communication across our platform is encrypted via 256-bit TLS/SSL certificates.
        </p>
      </section>
    </div>
  );
}
