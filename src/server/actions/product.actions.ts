import { prisma } from "@/lib/db";
import { FilterParams } from "@/types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data";

export async function getHomepageData() {
  try {
    const [categories, featuredProducts, newArrivals, banners] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED", isFeatured: true },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
        take: 8,
      }),
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
        take: 8,
      }),
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    if (categories.length > 0) {
      return { categories, featuredProducts, newArrivals, banners };
    }
  } catch (err) {
    console.warn("Database query in getHomepageData failed or timed out, loading catalog fallback:", err);
  }

  // Graceful fallback from curated catalog
  return {
    categories: MOCK_CATEGORIES,
    featuredProducts: MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8),
    newArrivals: MOCK_PRODUCTS.slice(0, 8),
    banners: [
      {
        id: "b1",
        title: "Quiet Living Collection",
        subtitle: "Warm minimalism, intentional joinery, and natural living textiles.",
        buttonText: "Shop the Collection",
        link: "/products",
        imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80",
        sortOrder: 0,
        isActive: true,
      },
    ],
  };
}

export async function getProducts(params: FilterParams = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    rating,
    sort = "featured",
    search,
    inStock,
    page = 1,
    limit = 12,
  } = params;

  const where: any = {
    status: "PUBLISHED",
  };

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStock) {
    where.stock = { gt: 0 };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "featured") orderBy = { isFeatured: "desc" };

  try {
    const skip = (page - 1) * limit;
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          reviews: { where: { status: "APPROVED" } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    if (products.length > 0) {
      const formatted = products.map((p) => {
        const avg =
          p.reviews.length > 0
            ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
            : 5.0;

        return {
          ...p,
          price: Number(p.price),
          salePrice: p.salePrice ? Number(p.salePrice) : null,
          averageRating: avg,
          reviewCount: p.reviews.length,
        };
      });

      return {
        products: formatted,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    }
  } catch (err) {
    console.warn("Database query in getProducts failed, filtering curated fallback catalog:", err);
  }

  // Fallback to in-memory curated catalog
  let filtered = [...MOCK_PRODUCTS];

  if (category) {
    const catSlug = category.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const s = p.category.slug.toLowerCase();
      return (
        s === catSlug ||
        (catSlug === "furniture" && s.includes("furniture")) ||
        (catSlug === "lighting" && s.includes("lighting")) ||
        (catSlug.includes("ceramic") && s.includes("ceramic")) ||
        (catSlug.includes("textile") && s.includes("textile")) ||
        (catSlug.includes("decor") && s.includes("decor"))
      );
    });
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice ?? p.price) <= maxPrice);
  }

  if (inStock) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  } else if (sort === "featured") {
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const totalCount = filtered.length;
  const skip = (page - 1) * limit;
  const paginated = filtered.slice(skip, skip + limit);

  return {
    products: paginated,
    totalCount,
    totalPages: Math.ceil(totalCount / limit) || 1,
    currentPage: page,
  };
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { createdAt: "asc" } },
        reviews: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
        },
      },
    });

    if (product) {
      const related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          status: "PUBLISHED",
        },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
        take: 4,
      });

      const avg =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          : 5.0;

      return {
        ...product,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        averageRating: avg,
        reviewCount: product.reviews.length,
        related: related.map((r) => ({
          ...r,
          price: Number(r.price),
          salePrice: r.salePrice ? Number(r.salePrice) : null,
        })),
      };
    }
  } catch (err) {
    console.warn("Database query in getProductBySlug failed, checking fallback catalog:", err);
  }

  // Fallback product from catalog
  const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!found) return null;

  const related = MOCK_PRODUCTS.filter(
    (p) => p.categoryId === found.categoryId && p.id !== found.id
  ).slice(0, 4);

  return {
    ...found,
    related: related.map((r) => ({
      ...r,
      price: Number(r.price),
      salePrice: r.salePrice ? Number(r.salePrice) : null,
    })),
  };
}
