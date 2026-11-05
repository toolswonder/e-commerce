"use client";

import React, { useState } from "react";
import { Star, CheckCircle, MessageSquarePlus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date | string;
  user: {
    name?: string | null;
    image?: string | null;
  };
}

interface ReviewListProps {
  productId: string;
  productTitle: string;
  reviews: Review[];
  averageRating: number;
}

export function ReviewList({
  productId,
  productTitle,
  reviews,
  averageRating,
}: ReviewListProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsOpen(false);
      setTitle("");
      setComment("");
      toast({
        title: "Review Submitted for Moderation",
        description: "Thank you for sharing your experience. Your review will appear shortly.",
        type: "success",
      });
    }, 600);
  };

  return (
    <section className="space-y-8 pt-10 border-t border-zinc-100">
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-light text-zinc-950">
            Customer Reflections
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(averageRating) ? "fill-amber-500" : "text-zinc-200 fill-zinc-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-zinc-900">
              {averageRating.toFixed(1)} out of 5
            </span>
            <span className="text-xs text-zinc-400">
              Based on {reviews.length} authentic purchase{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="rounded-full text-xs gap-1.5 self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" /> Write a Review
        </Button>
      </div>

      {/* Review Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-100 z-10 space-y-4">
              <h4 className="font-serif text-lg font-medium text-zinc-950">
                Reflect on {productTitle}
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? "fill-amber-500" : "text-zinc-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1.5">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exceptional joinery and tactile warmth"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-700 mb-1.5">
                    Your Experience &amp; Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how the object feels, functions, and looks in your space..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="sm"
                    className="text-xs bg-zinc-900 hover:bg-zinc-800"
                  >
                    {submitting ? "Submitting..." : "Post Review"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="divide-y divide-zinc-100">
        {reviews.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-6">
            No reflections have been shared for this edition yet. Be the first to share your thoughts.
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="py-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? "fill-amber-500" : "text-zinc-200 fill-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                  {r.title && (
                    <span className="text-sm font-semibold text-zinc-900">
                      {r.title}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400">{formatDate(r.createdAt)}</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
                {r.comment}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
                <span className="font-medium text-zinc-900">
                  {r.user.name || "Anonymous Patron"}
                </span>
                {r.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle className="w-3 h-3" /> Verified Patron
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
