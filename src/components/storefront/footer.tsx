"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-24 lg:pb-12 border-t border-zinc-900">
      {/* Brand values banner strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center md:items-start gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Carbon-Neutral Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1">Complimentary worldwide on orders above $150.</p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Master Artisanship</h4>
              <p className="text-xs text-zinc-400 mt-1">Sustainably sourced FSC timbers and hand-thrown clay.</p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-500 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Sanctuary Guarantee</h4>
              <p className="text-xs text-zinc-400 mt-1">Effortless return pickups with original packaging.</p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Encrypted Checkout</h4>
              <p className="text-xs text-zinc-400 mt-1">PCI-DSS Level 1 tokenized Stripe & Razorpay payments.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="font-serif tracking-[0.25em] text-2xl font-bold text-white inline-block">
              AURA
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              We design and curate timeless home objects bridging Danish quietude and Japanese craftsmanship. Created for mindful living and modern domestic sanctuaries.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <p className="text-xs font-medium text-white mb-2">Join the AURA Journal</p>
              <p className="text-[11px] text-zinc-400 mb-3">
                Receive private seasonal previews, atelier stories, and 10% off your inaugural order.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Welcome to the circle. Check your inbox for your code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                  >
                    Join <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Collection</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/categories/furniture" className="hover:text-white transition-colors">Solid Oak & Walnut Furniture</Link></li>
              <li><Link href="/categories/lighting" className="hover:text-white transition-colors">Washi & Brass Lighting</Link></li>
              <li><Link href="/categories/ceramics-dining" className="hover:text-white transition-colors">Hand-Thrown Stoneware</Link></li>
              <li><Link href="/categories/textiles-rugs" className="hover:text-white transition-colors">Belgian Linen & Wool Rugs</Link></li>
              <li><Link href="/categories/home-decor" className="hover:text-white transition-colors">Sculptural Home Decor</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">View All Products</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Concierge</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Order Status</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery Rates</Link></li>
              <li><Link href="/shipping#returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Our Atelier</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Design Philosophy</Link></li>
              <li><Link href="/about#sustainability" className="hover:text-white transition-colors">Ethical Materiality</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/admin" className="text-zinc-600 hover:text-amber-500 transition-colors">Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-12 mt-12 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} AURA Living Inc. All rights reserved. Crafted for mindful living.</p>
          <div className="flex items-center gap-6">
            <span>WCAG 2.1 AA Compliant</span>
            <span>SSL Secured</span>
            <span>FSC Certified Materials</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
