"use client";

import React, { useState } from "react";
import { toggleCustomerBlockAction } from "@/server/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

export function CustomerBlockButton({
  customerId,
  isBlocked,
}: {
  customerId: string;
  isBlocked: boolean;
}) {
  const { toast } = useToast();
  const [blocked, setBlocked] = useState(isBlocked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleCustomerBlockAction(customerId, !blocked);
      setBlocked(res.isBlocked);
      toast({
        title: res.isBlocked ? "Customer Suspended" : "Customer Re-activated",
        description: res.isBlocked
          ? "Account access has been restricted."
          : "Account access has been restored.",
        type: res.isBlocked ? "error" : "success",
      });
    } catch {
      toast({ title: "Failed to update customer status", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
        blocked
          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          : "bg-red-50 text-red-700 hover:bg-red-100"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : blocked ? (
        "Unblock Access"
      ) : (
        "Suspend Account"
      )}
    </button>
  );
}
