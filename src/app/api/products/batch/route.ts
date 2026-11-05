import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json([]);
  }

  const ids = idsParam.split(",").filter(Boolean);

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      sku: p.sku,
      stock: p.stock,
      category: p.category.name,
      image: p.images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Batch products error:", err);
    return NextResponse.json([]);
  }
}
