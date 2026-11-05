"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateSettingAction } from "@/server/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { Loader2, Check, Save } from "lucide-react";

export function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    store_name: initialSettings.store_name || "AURA Living",
    store_email: initialSettings.store_email || "concierge@auraliving.com",
    free_shipping_threshold: initialSettings.free_shipping_threshold || "150",
    standard_shipping_rate: initialSettings.standard_shipping_rate || "15.00",
    tax_rate_percent: initialSettings.tax_rate_percent || "8.5",
    currency: initialSettings.currency || "USD",
    currency_symbol: initialSettings.currency_symbol || "$",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const [key, val] of Object.entries(settings)) {
        await updateSettingAction(key, val);
      }
      toast({
        title: "Settings Saved",
        description: "Store configuration has been updated across the platform.",
        type: "success",
      });
    } catch {
      toast({ title: "Failed to update settings", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 shadow-sm">
      {/* Brand Identity */}
      <div className="space-y-4">
        <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
          Storefront Identity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
              Store Public Name
            </label>
            <input
              type="text"
              value={settings.store_name}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
              Concierge Email
            </label>
            <input
              type="email"
              value={settings.store_email}
              onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
            />
          </div>
        </div>
      </div>

      {/* Shipping & Tax */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
          Shipping &amp; Tax Policies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
              Free Shipping Order Minimum ($)
            </label>
            <input
              type="number"
              value={settings.free_shipping_threshold}
              onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
              Standard Flat Shipping ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.standard_shipping_rate}
              onChange={(e) => setSettings({ ...settings, standard_shipping_rate: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
              Estimated Sales Tax (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.tax_rate_percent}
              onChange={(e) => setSettings({ ...settings, tax_rate_percent: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200"
            />
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-100">
          Currency Standard
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
              ISO Currency Code
            </label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 uppercase font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
              Currency Symbol
            </label>
            <input
              type="text"
              value={settings.currency_symbol}
              onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full text-xs h-11 bg-zinc-900 hover:bg-zinc-800 text-white gap-2 shadow"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save System Configuration
        </Button>
      </div>
    </form>
  );
}
