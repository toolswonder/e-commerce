import React from "react";
import { prisma } from "@/lib/db";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settingsMap: Record<string, string> = {
    store_name: "AURA Living",
    store_email: "concierge@auraliving.com",
    free_shipping_threshold: "150",
    tax_rate: "0.08",
    currency: "USD",
  };

  try {
    const settings = await prisma.setting.findMany();
    if (settings.length > 0) {
      settingsMap = settings.reduce((acc, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {} as Record<string, string>);
    }
  } catch (err) {
    console.warn("DB query failed in AdminSettingsPage, falling back to default settings:", err);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="font-serif text-3xl font-light text-zinc-950">
          Store Configuration &amp; Policies
        </h1>
        <p className="text-xs text-zinc-500 font-light mt-1">
          Adjust store identity, free shipping value thresholds, sales tax rate, and notification parameters.
        </p>
      </div>

      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
