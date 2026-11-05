"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, ArrowRight, Shield, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const fillCredentials = (type: "admin" | "customer") => {
    if (type === "admin") {
      setEmail("admin@auraliving.com");
      setPassword("AdminPass123!");
    } else {
      setEmail("customer@example.com");
      setPassword("CustomerPass123!");
    }
    setErrorMsg("");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="font-serif tracking-[0.25em] text-2xl font-bold text-zinc-950 inline-block">
          AURA
        </Link>
        <h1 className="font-serif text-2xl font-light text-zinc-950">
          Sign In to Your Sanctuary
        </h1>
        <p className="text-xs text-zinc-500 font-light">
          Access your orders, track shipments, and manage saved designs.
        </p>
      </div>

      {/* Quick Fill Demo Badges */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-700" /> Demo Quick-Fill Credentials
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillCredentials("admin")}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 text-left transition-colors"
          >
            <span className="font-bold block">Admin Account</span>
            <span className="text-[10px] text-zinc-500">Full control panel</span>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials("customer")}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 text-left transition-colors"
          >
            <span className="font-bold block">Customer Account</span>
            <span className="text-[10px] text-zinc-500">Order &amp; addresses</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              placeholder="e.g. admin@auraliving.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-zinc-500 hover:text-zinc-900 underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider gap-2 shadow"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              Sign In to Account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <div className="pt-2 text-center text-xs text-zinc-500">
          New to AURA?{" "}
          <Link href="/register" className="font-semibold text-zinc-950 hover:underline">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
