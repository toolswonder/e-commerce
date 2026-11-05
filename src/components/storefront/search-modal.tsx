"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  category: string;
}

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Box */}
        <div className="inline-block w-full max-w-2xl my-16 text-left align-middle transition-all transform bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-100">
          <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-400 shrink-0 ml-2" />
            <input
              type="text"
              autoFocus
              placeholder="Search furniture, lighting, ceramics, textiles... (Press Esc to close)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-base bg-transparent border-0 focus:outline-none focus:ring-0 text-zinc-900 placeholder:text-zinc-400"
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 divide-y divide-zinc-50">
            {query.trim() === "" ? (
              <div className="py-6 px-4">
                <p className="text-xs uppercase font-semibold text-zinc-400 tracking-wider mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Lounge Chair", "Ceramic Pour-Over", "Moroccan Rug", "Washi Lamp", "Belgian Linen"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-700 font-medium">{item.category}</p>
                    <h4 className="text-sm font-medium text-zinc-900 group-hover:text-amber-800 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs font-semibold text-zinc-900 mt-0.5">
                      {formatPrice(item.salePrice || item.price)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                </Link>
              ))
            ) : (
              !loading && (
                <div className="py-12 text-center text-sm text-zinc-500">
                  No matching artisanal products found for &ldquo;{query}&rdquo;.
                </div>
              )
            )}
          </div>

          <div className="p-3 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 flex justify-between items-center px-6">
            <span>
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 font-mono">Cmd + K</kbd> anytime to search
            </span>
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="font-medium text-zinc-900 hover:text-amber-700"
            >
              See all results →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
