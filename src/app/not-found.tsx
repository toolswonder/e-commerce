import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-5">
      <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 mb-2">
        <Compass className="w-8 h-8 stroke-1 text-amber-700" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
        404 · Uncharted Domain
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950">
        This Sanctuary Page Does Not Exist
      </h1>
      <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto font-light leading-relaxed">
        The piece or page you were seeking may have moved to a different archive or is no longer part of our collection.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow"
        >
          Return to Sanctuary Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
