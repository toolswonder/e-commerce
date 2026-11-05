import React from "react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { ReviewModerationButtons } from "./review-moderation-buttons";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  let reviews: any[] = [];
  try {
    reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { title: true, slug: true } },
        user: { select: { name: true, email: true } },
      },
    });
  } catch (err) {
    console.warn("DB query failed in AdminReviewsPage, falling back to mock reviews:", err);
    reviews = [
      {
        id: "rev-1",
        status: "APPROVED",
        rating: 5,
        title: "Transcendent craftsmanship",
        comment: "The joinery is flawless and the paper cord has the perfect balance of tensile support and organic give.",
        createdAt: new Date(),
        product: { title: "Kyoto Solid White Oak Lounge Chair", slug: "kyoto-solid-white-oak-lounge-chair" },
        user: { name: "Eleanor Vance", email: "eleanor.vance@studio.org" },
      },
      {
        id: "rev-2",
        status: "PENDING",
        rating: 5,
        title: "Stunning ambient luminescence",
        comment: "Suspended this above our 8-seater oak table. The diffused light completely transforms evening dinners.",
        createdAt: new Date(Date.now() - 3600000 * 5),
        product: { title: "Akari Japanese Washi Paper Pendant", slug: "akari-japanese-washi-paper-pendant" },
        user: { name: "Julian Thorne", email: "julian@thorne-arch.com" },
      },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="font-serif text-3xl font-light text-zinc-950">
          Reviews &amp; Testimonials Moderation
        </h1>
        <p className="text-xs text-zinc-500 font-light mt-1">
          Moderate customer reflections, ratings, and verified purchaser reviews before public catalog display.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Product</th>
              <th className="p-3.5">Author</th>
              <th className="p-3.5">Rating</th>
              <th className="p-3.5">Headline &amp; Feedback</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Moderation Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="p-3.5 font-medium text-zinc-950 max-w-xs truncate">
                  {r.product.title}
                </td>
                <td className="p-3.5">
                  <p className="font-medium text-zinc-900">{r.user.name || "Patron"}</p>
                  <p className="text-[11px] text-zinc-400">{r.user.email}</p>
                </td>
                <td className="p-3.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < r.rating ? "fill-amber-500" : "text-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-3.5 max-w-sm">
                  {r.title && <p className="font-semibold text-zinc-900">{r.title}</p>}
                  <p className="text-zinc-600 line-clamp-2">{r.comment}</p>
                </td>
                <td className="p-3.5 text-zinc-400">{formatDate(r.createdAt)}</td>
                <td className="p-3.5">
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      r.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <ReviewModerationButtons reviewId={r.id} currentStatus={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
