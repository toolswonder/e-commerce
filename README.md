# AURA Living — Production-Ready E-Commerce Platform

A production-grade, full-stack e-commerce platform and operational admin console built with **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL**, **NextAuth.js**, **Stripe / Razorpay**, and **Resend**.

---

## 1. System Architecture & Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ (App Router) | Server Components, Server Actions, ISR & Edge Routing |
| **Language** | TypeScript (Strict mode) | Type-safe end-to-end APIs & DB models |
| **Styling & UI** | Tailwind CSS + shadcn/ui | 8px spacing grid, WCAG AA contrast, warm minimalist theme |
| **Database** | PostgreSQL | Hosted on Supabase / Neon with composite indexes |
| **ORM** | Prisma ORM v6 | Auto-generated types, relation cascades, migrations |
| **Authentication** | NextAuth.js | Credentials (bcryptjs) + Google OAuth, JWT role-based access |
| **Payments** | Stripe & Razorpay | Webhook signature verification, idempotent order processing |
| **SEO** | Metadata + JSON-LD | OpenGraph, dynamic sitemap.xml, robots.txt, Product schema |

---

## 2. Default Demo Accounts

Two pre-configured accounts are seeded and ready for testing:

### Administrator Account (Full Operations Access)
- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@auraliving.com`
- **Password**: `AdminPass123!`
- **Role**: `ADMIN` (Access to dashboard analytics, products CRUD, fulfillment, stock editing, coupons, reviews moderation, settings, audit log)

### Patron / Customer Account
- **URL**: `http://localhost:3000/login`
- **Email**: `customer@example.com`
- **Password**: `CustomerPass123!`
- **Role**: `CUSTOMER` (Order history, shipment tracking, addresses, wishlist)

> [!TIP]
> The `/login` page includes **1-click Quick-Fill buttons** for both the Admin and Customer accounts for effortless instant testing.

---

## 3. Quickstart & Local Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` is set to your PostgreSQL database.

### Step 3: Run Database Migrations & Seed
```bash
# Generate Prisma Client
npx prisma generate

# Seed 20 curated products, 5 categories, 1 admin, 1 customer, coupons, banners, and sample orders
npm run seed
```

### Step 4: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Key Functional Features

### Customer Storefront
1. **Homepage (`/`)**:
   - Hero banner with atmospheric photography and responsive CTAs.
   - Disciplines / Featured Categories carousel.
   - Curated Bestsellers grid with quick add to cart.
   - Editorial story banner and New Additions section.
   - Newsletter subscription form.
2. **Product Catalog (`/products`)**:
   - Server-side faceted filtering: Category, Price Range, In-Stock only.
   - Sorting: Featured, Newest, Price Low-to-High, Price High-to-Low.
   - Instant search modal with `Cmd+K` keyboard shortcut and live suggestions.
   - Responsive pagination.
3. **Product Detail (`/products/[slug]`)**:
   - High-resolution gallery with thumbnail selector and cursor zoom lens.
   - Interactive variant selector (materials, finishes, dimensions) with live price updates.
   - Real-time stock status badge (In Stock, Low Stock Warning, Sold Out).
   - Star rating breakdown and verified customer reviews with submission dialog.
   - Schema.org `Product` JSON-LD structured data.
4. **Cart System (Slide-Over Drawer + `/cart` Page)**:
   - Dynamic free-shipping progress tracker (unlocks above $150).
   - Quantity increment/decrement and item removal.
   - Coupon code engine (`WELCOME10` for 10% off, `SAVE50` for $50 off orders over $250).
   - Real-time calculation of subtotal, discounts, shipping, tax (8.5%), and total.
5. **Checkout Flow (`/checkout`)**:
   - Multi-step patron contact and shipping address form.
   - Payment method selection: Stripe credit/debit card, Razorpay, or Pay on Delivery.
   - **Server-Side Price Integrity**: All totals are recalculated on the server directly from the database to prevent client tampering.
6. **Order Confirmation & Tracking (`/checkout/success` & `/account/orders/[id]`)**:
   - Live order timeline (Ordered → Payment Verified → In Atelier → Delivered).
   - Itemized purchase breakdown with printable invoice view (`window.print()`).
7. **Patron Account Hub (`/account`)**:
   - Profile overview and lifetime spend metrics.
   - Order history with tracking number links.
   - Saved shipping destinations management.
   - Wishlist sanctuary with 1-click "Move to Cart".

---

## 5. Admin Console (`/admin`) — ADMIN Role Protected

All routes under `/admin/*` are strictly guarded by middleware and server-side role validation.

1. **Dashboard Overview (`/admin`)**:
   - Gross Revenue, Total Orders, Active Patrons, Low-Stock Warnings KPIs.
   - Interactive SVG Sales Performance Chart with 7, 30, and 90-day filters.
   - Recent orders log and top-selling catalog pieces.
2. **Products Management (`/admin/products`)**:
   - Search by title or SKU.
   - Inline stock adjustment without navigating away.
   - Delete product with confirmation dialog.
   - CSV export via `/api/export/products`.
   - Add new product wizard (`/admin/products/new`) with multi-image URLs, variant editions builder, and SEO metadata.
3. **Categories (`/admin/categories`)**:
   - Parent / child category hierarchy visualization.
   - Create category modal dialog with slugification.
4. **Fulfillment & Orders (`/admin/orders`)**:
   - Status filtering: Pending, Paid, Processing, Shipped, Delivered, Cancelled, Refunded.
   - Detail view (`/admin/orders/[id]`) to assign courier tracking numbers and carriers.
   - One-click order refund action.
5. **Patron Directory (`/admin/customers`)**:
   - Customer list with lifetime spend and order count.
   - Account suspension / re-activation toggle.
6. **Promotions & Coupons (`/admin/coupons`)**:
   - Create percentage or fixed discount codes with minimum order constraints and usage limits.
7. **Inventory Replenishment (`/admin/inventory`)**:
   - Fast workshop stock adjustments and low-stock warnings.
8. **Reviews Moderation (`/admin/reviews`)**:
   - Approve or reject customer reviews before public display.
9. **Store Settings (`/admin/settings`)**:
   - Configure public brand name, contact email, free-shipping threshold, and sales tax rate.
10. **Audit Logs (`/admin/audit-logs`)**:
    - Complete immutable audit trail recording every administrative creation, deletion, status update, and stock shift.

---

## 6. Testing & Verification Checklist

1. **Build & Type Check**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. **Test Customer Flow**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Browse catalog at `/products`, filter by price and category.
   - Open a product, select variants, and click **Add to Cart**.
   - Open Cart Drawer, apply coupon `WELCOME10` (verify 10% discount).
   - Proceed to `/checkout`, enter shipping details, and click **Place Sanctuary Order**.
   - Verify redirect to `/checkout/success` with generated order number.
3. **Test Admin Operations**:
   - Sign in at `/login` using `admin@auraliving.com` / `AdminPass123!`.
   - Navigate to `/admin`.
   - Verify KPI cards, charts, and recent orders.
   - Go to `/admin/orders` and click on the newly placed order.
   - Update status to `SHIPPED`, enter tracking number `FDX-12345678`, and save.
   - Go to `/admin/products/new` to create a product.
   - View `/admin/audit-logs` to confirm all actions were logged.

---

## 7. Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. In the Vercel Dashboard, import the project.
3. Add the environment variables from `.env.example`:
   - `DATABASE_URL` (Supabase or Neon connection string)
   - `NEXTAUTH_URL` (Your production domain or `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` (A 32+ character random secret)
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
4. Deploy! Next.js App Router will build and serve the application globally with edge caching.
