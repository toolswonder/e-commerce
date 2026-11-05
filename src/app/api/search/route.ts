import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { shortDescription: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
      take: 6,
    });

    if (products.length > 0) {
      const formatted = products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        image: p.images[0]?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
        category: p.category.name,
      }));

      return NextResponse.json(formatted);
    }
  } catch (err) {
    console.warn("Search DB error, searching catalog fallback:", err);
  }

  // Fallback search across curated catalog
  const { MOCK_PRODUCTS } = await import("@/lib/mock-data");
  const query = q.toLowerCase().trim();
  const matched = MOCK_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.name.toLowerCase().includes(query)
  ).slice(0, 6);

  return NextResponse.json(
    matched.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      image: p.images[0]?.url || "",
      category: p.category.name,
    }))
  );
}
