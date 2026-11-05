import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MapPin, Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AccountAddressesPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/addresses");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-light text-zinc-950">
            Saved Delivery Destinations
          </h1>
          <p className="text-xs text-zinc-500 font-light mt-1">
            Manage your personal shipping addresses for streamlined checkout.
          </p>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-100 p-8 space-y-2">
          <MapPin className="w-8 h-8 mx-auto text-zinc-400 stroke-1" />
          <p className="font-medium text-zinc-900">No Saved Addresses</p>
          <p className="text-zinc-500 max-w-xs mx-auto">
            Your delivery addresses will be automatically remembered here during checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all ${
                addr.isDefault
                  ? "border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-sm"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-xs text-zinc-900">
                  {addr.fullName}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Default
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-600 space-y-0.5 leading-relaxed font-light">
                <p>{addr.street} {addr.apartment}</p>
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                <p>{addr.country}</p>
                <p className="pt-2 text-zinc-400">{addr.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
