import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ImageIcon, Plus, Check } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-zinc-950">
            Homepage Banners &amp; Visual Content
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">
            Manage promotional hero carousels, seasonal badges, and editorial callout banners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((ban) => (
          <div
            key={ban.id}
            className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm space-y-4"
          >
            <div className="relative aspect-[16/9] bg-zinc-900">
              <Image
                src={ban.imageUrl}
                alt={ban.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {ban.badge && (
                <span className="absolute top-3 left-3 bg-zinc-900/80 text-white text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  {ban.badge}
                </span>
              )}
            </div>

            <div className="p-5 pt-0 space-y-2">
              <h3 className="font-serif text-lg font-medium text-zinc-950">
                {ban.title}
              </h3>
              {ban.subtitle && (
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  {ban.subtitle}
                </p>
              )}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <span>Destination: <span className="font-mono text-zinc-900">{ban.linkUrl || "/"}</span></span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
