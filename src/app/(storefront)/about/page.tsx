import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles, Trees, Shield } from "lucide-react";

export const metadata = {
  title: "About Our Atelier",
  description: "Learn about AURA Living, our design manifesto, and our commitment to sustainable craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
          Our Atelier &amp; Origins
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-zinc-950 leading-tight">
          Crafting Quietude for the Modern Sanctuary
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
          Founded in 2026, AURA was born from a desire to strip away visual clutter and return to the grounding tactile essence of authentic materials.
        </p>
      </div>

      {/* Feature Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 shadow-md">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
          alt="Artisan woodworker workshop"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-6">
        <div className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-amber-50 text-amber-800">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-medium text-zinc-950">
            Japandi Synthesis
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
            We unite the functional warmth of Scandinavian hygge with the Japanese philosophy of wabi-sabi—celebrating natural grain, asymmetric ceramic textures, and gentle aging.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-amber-50 text-amber-800">
            <Trees className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-medium text-zinc-950">
            FSC Certified Timbers
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
            Every piece of solid oak, ash, and walnut originates from responsibly managed European and North American forestry collectives. We use zero petroleum-based solvent finishes.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-amber-50 text-amber-800">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-medium text-zinc-950">
            Heirloom Longevity
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
            Our furniture is built using mortise-and-tenon joinery and brass fastenings engineered to be repaired, refinished, and passed between generations.
          </p>
        </div>
      </div>

      {/* Story Statement */}
      <div className="bg-zinc-50 rounded-2xl p-8 sm:p-12 border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-serif text-2xl font-light text-zinc-950">
            Experience the Collection in Person
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 font-light">
            Book a private design consultation or explore material samples with our atelier concierge.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shrink-0"
        >
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
