"use client";

import React, { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/server/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { Loader2, Check, RotateCcw } from "lucide-react";

export function OrderManageForm({
  orderId,
  currentStatus,
  currentTracking,
  currentCarrier,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  currentTracking?: string | null;
  currentCarrier?: string | null;
}) {
  const { toast } = useToast();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTracking || "");
  const [shippingCarrier, setShippingCarrier] = useState(currentCarrier || "FedEx Freight");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateOrderStatusAction(orderId, status, trackingNumber, shippingCarrier);
      toast({
        title: "Order Updated",
        description: `Order status set to ${status}.`,
        type: "success",
      });
    } catch {
      toast({ title: "Failed to update order", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to issue a full refund for this order? This will mark the order as REFUNDED and log an audit trail.")) {
      return;
    }
    setLoading(true);
    try {
      await updateOrderStatusAction(orderId, "REFUNDED", trackingNumber, shippingCarrier);
      setStatus("REFUNDED");
      toast({
        title: "Refund Processed",
        description: "Order marked as REFUNDED.",
        type: "info",
      });
    } catch {
      toast({ title: "Failed to process refund", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/80 space-y-4">
      <h3 className="font-serif text-base font-medium text-zinc-950 pb-2 border-b border-zinc-200">
        Fulfillment Controls
      </h3>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Order Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium"
          >
            <option value="PENDING">PENDING (Awaiting Payment)</option>
            <option value="PAID">PAID (Payment Verified)</option>
            <option value="PROCESSING">PROCESSING (In Atelier Packaging)</option>
            <option value="SHIPPED">SHIPPED (En Route via Courier)</option>
            <option value="DELIVERED">DELIVERED (Completed)</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Courier Carrier
          </label>
          <input
            type="text"
            placeholder="FedEx Freight, DHL Express, UPS"
            value={shippingCarrier}
            onChange={(e) => setShippingCarrier(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Tracking Number
          </label>
          <input
            type="text"
            placeholder="e.g. FDX-9920148821"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 text-xs h-10 bg-zinc-900 hover:bg-zinc-800 text-white gap-2 shadow"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save Status &amp; Tracking
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleRefund}
            disabled={loading || status === "REFUNDED"}
            className="text-xs h-10 text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Refund Order
          </Button>
        </div>
      </form>
    </div>
  );
}
