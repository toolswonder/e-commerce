"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Shield, Bell, LogOut, ExternalLink } from "lucide-react";

export function AdminHeader({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <span className="font-semibold text-xs tracking-wider uppercase text-zinc-400">
          Operations
        </span>
        <span className="text-zinc-300">/</span>
        <span className="text-xs font-semibold text-zinc-900">Live Management</span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {user.name?.[0] || "A"}
          </div>
          <div className="hidden sm:block text-right">
            <p className="font-semibold text-zinc-900 leading-tight">{user.name}</p>
            <p className="text-[11px] text-zinc-500 leading-tight">Master Administrator</p>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Sign Out of Admin Console"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
