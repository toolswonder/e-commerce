import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/server/actions/admin.actions";

export async function GET() {
  try {
    await requireAdmin();

    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "ID",
      "SKU",
      "Title",
      "Category",
      "Price",
      "Sale Price",
      "Stock",
      "Status",
      "Created At",
    ];

    const rows = products.map((p) => [
      p.id,
      `"${p.sku}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category.name}"`,
      Number(p.price).toFixed(2),
      p.salePrice ? Number(p.salePrice).toFixed(2) : "",
      p.stock,
      p.status,
      new Date(p.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="aura-products-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Export failed" }, { status: 403 });
  }
}
