"use client";

import React, { useState } from "react";
import { updateReviewStatusAction } from "@/server/actions/admin.actions";
import { useToast } from "@/components/ui/toast";
import { ReviewStatus } from "@prisma/client";
import { Check, X, Loader2 } from "lucide-react";

export function ReviewModerationButtons({
  reviewId,
  currentStatus,
}: {
  reviewId: string;
  currentStatus: ReviewStatus;
}) {
  const { toast } = useToast();
  const [status, setStatus] = useState<ReviewStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: ReviewStatus) => {
    setLoading(true);
    try {
      await updateReviewStatusAction(reviewId, newStatus);
      setStatus(newStatus);
      toast({
        title: `Review ${newStatus === "APPROVED" ? "Approved" : "Rejected"}`,
        type: newStatus === "APPROVED" ? "success" : "info",
      });
    } catch {
      toast({ title: "Failed to update review", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {status !== "APPROVED" && (
        <button
          onClick={() => handleUpdate("APPROVED")}
          disabled={loading}
          className="p-1 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          title="Approve review"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        </button>
      )}

      {status !== "REJECTED" && (
        <button
          onClick={() => handleUpdate("REJECTED")}
          disabled={loading}
          className="p-1 rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          title="Reject review"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
