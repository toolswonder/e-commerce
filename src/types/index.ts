import { Product, ProductImage, ProductVariant, Category, Review, Order, OrderItem, Address, User } from "@prisma/client";

export type Role = "CUSTOMER" | "ADMIN";

export type ProductWithDetails = Product & {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: (Review & { user: Pick<User, "name" | "image"> })[];
  _count?: {
    reviews: number;
  };
  averageRating?: number;
};

export type CartItemWithDetails = {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: Product & {
    images: ProductImage[];
  };
  variant?: ProductVariant | null;
};

export type OrderWithDetails = Order & {
  items: (OrderItem & {
    product?: (Product & { images: ProductImage[] }) | null;
  })[];
  user?: Pick<User, "name" | "email"> | null;
  shippingAddress?: Address | null;
};

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "featured" | "rating";
  search?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}
