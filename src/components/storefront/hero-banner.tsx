import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white min-h-[580px] lg:min-h-[660px] flex items-center">
      {/* Background Lifestyle Image with gradient scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
          alt="Curated minimalist interior sanctuary"
          fill
          priority
          className="object-cover object-center brightness-[0.65] contrast-[1.05]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>2026 Spring Atelier Edition</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.15]">
            Artisanal Living &amp; <br />
            <span className="italic font-normal text-amber-200/90">Timeless</span> Craft.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
            Warm minimalist furniture, atmospheric paper lighting, and wheel-thrown ceramics. Designed between Kyoto quietude and Nordic serenity for modern home sanctuaries.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-zinc-950 text-xs font-semibold tracking-wider uppercase hover:bg-amber-100 transition-all shadow-lg hover:shadow-white/20"
            >
              Shop Curated Collection <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/categories/ceramics-dining"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wider uppercase transition-all"
            >
              Ceramics &amp; Dining
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
