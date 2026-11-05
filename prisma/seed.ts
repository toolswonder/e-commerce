import { PrismaClient, Role, ProductStatus, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleared existing records.");

  // 2. Users (Admin + Customer)
  const adminPasswordHash = await bcrypt.hash("AdminPass123!", 10);
  const customerPasswordHash = await bcrypt.hash("CustomerPass123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Aura Administrator",
      email: "admin@auraliving.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Sophia Vance",
      email: "customer@example.com",
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      addresses: {
        create: {
          fullName: "Sophia Vance",
          phone: "+1 (555) 019-2834",
          street: "742 Evergreen Terrace",
          apartment: "Suite 4B",
          city: "San Francisco",
          state: "CA",
          postalCode: "94107",
          country: "US",
          isDefault: true,
        },
      },
    },
  });

  console.log("Created users:", admin.email, customer.email);

  // 3. Categories (5 Root Categories)
  const furniture = await prisma.category.create({
    data: {
      name: "Furniture",
      slug: "furniture",
      description: "Ergonomic, sculptural furniture crafted from sustainable solid oak, walnut, and ash.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
  });

  const lighting = await prisma.category.create({
    data: {
      name: "Lighting",
      slug: "lighting",
      description: "Atmospheric architectural illumination, rice paper pendants, and brass task lamps.",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
  });

  const ceramics = await prisma.category.create({
    data: {
      name: "Ceramics & Dining",
      slug: "ceramics-dining",
      description: "Hand-thrown stoneware, matte glazed dinnerware, and minimalist carafes.",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
  });

  const textiles = await prisma.category.create({
    data: {
      name: "Textiles & Rugs",
      slug: "textiles-rugs",
      description: "Unbleached organic Belgian linen, handwoven wool throws, and tactile jute floor rugs.",
      image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
      sortOrder: 4,
    },
  });

  const decor = await prisma.category.create({
    data: {
      name: "Home Decor",
      slug: "home-decor",
      description: "Sculptural marble bookends, sand-cast bronze trays, and botanical incense burners.",
      image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
      sortOrder: 5,
    },
  });

  console.log("Created 5 categories.");

  // 4. Products (20 Distinct, Curated Products)
  const productsData = [
    // Furniture (4)
    {
      title: "Kyoto Solid White Oak Lounge Chair",
      slug: "kyoto-solid-white-oak-lounge-chair",
      shortDescription: "Low-slung minimalist lounge chair with hand-woven Danish cord seating.",
      description: "The Kyoto Lounge Chair embodies warm Japanese-Nordic design principles. Meticulously handcrafted from FSC-certified solid white oak, featuring hand-strung natural paper cord seating engineered to contour organically to your posture over decades of use.",
      price: 680.0,
      salePrice: 620.0,
      costPrice: 320.0,
      sku: "FUR-KYO-001",
      stock: 14,
      isFeatured: true,
      categoryId: furniture.id,
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1580481077112-70197d6fb8fa?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Natural Oak / Natural Cord", sku: "FUR-KYO-001-NO", price: 620.0, stock: 8, attributes: { finish: "Natural Oak", cord: "Natural" } },
        { title: "Smoked Oak / Black Cord", sku: "FUR-KYO-001-SO", price: 650.0, stock: 6, attributes: { finish: "Smoked Oak", cord: "Black" } },
      ],
    },
    {
      title: "Oslo Minimalist Coffee Table",
      slug: "oslo-minimalist-coffee-table",
      shortDescription: "Rounded architectural low table with solid walnut joinery.",
      description: "Graceful curves and chamfered edges make the Oslo Coffee Table an anchor for serene living spaces. Treated with an organic matte oil finish that highlights the authentic grain of American walnut.",
      price: 490.0,
      salePrice: null,
      costPrice: 210.0,
      sku: "FUR-OSL-002",
      stock: 18,
      isFeatured: true,
      categoryId: furniture.id,
      images: [
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "American Walnut (90cm)", sku: "FUR-OSL-002-W90", price: 490.0, stock: 10, attributes: { wood: "American Walnut", size: "90cm" } },
        { title: "American Walnut (120cm)", sku: "FUR-OSL-002-W120", price: 580.0, stock: 8, attributes: { wood: "American Walnut", size: "120cm" } },
      ],
    },
    {
      title: "Arco Travertine Side Table",
      slug: "arco-travertine-side-table",
      shortDescription: "Geometric pedestal carved from solid honed Italian travertine.",
      description: "A monolithic accent sculpted from honed Roman travertine stone. Each piece displays unique natural veining and porous textural details, creating an organic focal point beside any seating arrangement.",
      price: 340.0,
      salePrice: 295.0,
      costPrice: 140.0,
      sku: "FUR-ARC-003",
      stock: 9,
      isFeatured: false,
      categoryId: furniture.id,
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Koto Floating Ash Bookshelf",
      slug: "koto-floating-ash-bookshelf",
      shortDescription: "Modular wall-mounted shelving unit with concealed brass hardware.",
      description: "Streamlined display system crafted from blonde ash. Features concealed structural wall cleats and chamfered partitions designed to gracefully display art objects and literature.",
      price: 275.0,
      salePrice: null,
      costPrice: 110.0,
      sku: "FUR-KOT-004",
      stock: 22,
      isFeatured: false,
      categoryId: furniture.id,
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },

    // Lighting (4)
    {
      title: "Lumina Washi Paper Pendant Lamp",
      slug: "lumina-washi-paper-pendant-lamp",
      shortDescription: "Handmade mulberry paper shade with warm diffused ambient glow.",
      description: "Inspired by traditional Japanese lantern crafting, the Lumina Pendant softly diffuses illumination through layered raw washi paper framed by flexible bamboo ribs.",
      price: 195.0,
      salePrice: 165.0,
      costPrice: 65.0,
      sku: "LGT-LUM-001",
      stock: 25,
      isFeatured: true,
      categoryId: lighting.id,
      images: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Medium (45cm)", sku: "LGT-LUM-001-M", price: 165.0, stock: 15, attributes: { diameter: "45cm" } },
        { title: "Large (60cm)", sku: "LGT-LUM-001-L", price: 215.0, stock: 10, attributes: { diameter: "60cm" } },
      ],
    },
    {
      title: "Brutalist Cast Brass Desk Lamp",
      slug: "brutalist-cast-brass-desk-lamp",
      shortDescription: "Heavy unlacquered brass task light with rotary dimmer switch.",
      description: "Crafted from unlacquered solid brass that will gently develop a rich heirloom patina over time. Features an integrated touch dimmer and precision 360-degree rotational arm.",
      price: 245.0,
      salePrice: null,
      costPrice: 95.0,
      sku: "LGT-BRU-002",
      stock: 12,
      isFeatured: true,
      categoryId: lighting.id,
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Aura Opal Glass Globe Chandelier",
      slug: "aura-opal-glass-globe-chandelier",
      shortDescription: "Balanced linear suspension chandelier with matte frosted glass globes.",
      description: "Five triplex opal blown-glass spheres anchored along an architectonic blackened steel frame. Emits non-glare warm ambient lighting ideal for dining tables and central islands.",
      price: 520.0,
      salePrice: 470.0,
      costPrice: 220.0,
      sku: "LGT-AUR-003",
      stock: 8,
      isFeatured: false,
      categoryId: lighting.id,
      images: [
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Sol Ceramic Portable Accent Lamp",
      slug: "sol-ceramic-portable-accent-lamp",
      shortDescription: "Rechargeable cordless bedside lamp with terracotta base and 40-hour runtime.",
      description: "A wireless luminous sphere on a hand-thrown terracotta pedestal. Integrated USB-C quick charge battery provides up to 40 hours of cordless illumination indoors and out.",
      price: 135.0,
      salePrice: null,
      costPrice: 48.0,
      sku: "LGT-SOL-004",
      stock: 30,
      isFeatured: false,
      categoryId: lighting.id,
      images: [
        "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Terracotta Clay", sku: "LGT-SOL-004-TC", price: 135.0, stock: 16, attributes: { color: "Terracotta" } },
        { title: "Matte Charcoal", sku: "LGT-SOL-004-CH", price: 135.0, stock: 14, attributes: { color: "Charcoal" } },
      ],
    },

    // Ceramics & Dining (4)
    {
      title: "Nordic Stoneware 12-Piece Dinnerware Set",
      slug: "nordic-stoneware-12-piece-dinnerware-set",
      shortDescription: "Complete artisan service for four in organic matte ivory glaze.",
      description: "Wheel-thrown high-fired stoneware designed for everyday rituals and elevated dinner parties. Includes 4 dinner plates, 4 salad plates, and 4 cereal/soup bowls. Dishwasher and microwave safe.",
      price: 210.0,
      salePrice: 185.0,
      costPrice: 75.0,
      sku: "CER-NOR-001",
      stock: 20,
      isFeatured: true,
      categoryId: ceramics.id,
      images: [
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Matte Ivory", sku: "CER-NOR-001-IV", price: 185.0, stock: 12, attributes: { finish: "Matte Ivory" } },
        { title: "Speckled Sandstone", sku: "CER-NOR-001-SS", price: 195.0, stock: 8, attributes: { finish: "Speckled Sandstone" } },
      ],
    },
    {
      title: "Handmade Pour-Over Ceramic Coffee Dripper & Carafe",
      slug: "handmade-pour-over-ceramic-coffee-dripper-carafe",
      shortDescription: "Sculptural single-origin coffee brewing vessel with heat-resistant handle.",
      description: "Engineered with internal vortex spiral extraction grooves for an optimal immersion bloom. Comes complete with a 650ml matching pitcher and unglazed lid.",
      price: 78.0,
      salePrice: null,
      costPrice: 28.0,
      sku: "CER-POU-002",
      stock: 45,
      isFeatured: true,
      categoryId: ceramics.id,
      images: [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Kyoto Matte Glaze Matcha Bowl Set",
      slug: "kyoto-matte-glaze-matcha-bowl-set",
      shortDescription: "Ceremonial chawan bowl with golden bamboo whisk and measuring scoop.",
      description: "Authentic ceremonial matcha set made in Uji, Japan. The wide rim allows ample room for whisking a rich, velvety micro-foam.",
      price: 65.0,
      salePrice: 55.0,
      costPrice: 22.0,
      sku: "CER-MAT-003",
      stock: 28,
      isFeatured: false,
      categoryId: ceramics.id,
      images: [
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Brutalist Ceramic Serving Platter",
      slug: "brutalist-ceramic-serving-platter",
      shortDescription: "Extra large freeform textured centerpiece serving platter.",
      description: "Measuring 42cm across, this statement serving tray features raw exposed clay edges and a smooth satiny food-safe volcanic ash glaze.",
      price: 115.0,
      salePrice: null,
      costPrice: 42.0,
      sku: "CER-SER-004",
      stock: 16,
      isFeatured: false,
      categoryId: ceramics.id,
      images: [
        "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },

    // Textiles & Rugs (4)
    {
      title: "Organic Belgian Washed Linen Duvet Set",
      slug: "organic-belgian-washed-linen-duvet-set",
      shortDescription: "Breathable pure flax bedding pre-washed for effortless drape and softness.",
      description: "Loomed from 100% certified European flax linen. Temperature regulating in all seasons, hypoallergenic, and becomes softer and more luxurious with every laundry cycle.",
      price: 260.0,
      salePrice: 225.0,
      costPrice: 98.0,
      sku: "TEX-LIN-001",
      stock: 19,
      isFeatured: true,
      categoryId: textiles.id,
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Natural Oatmeal / Queen", sku: "TEX-LIN-001-NQ", price: 225.0, stock: 10, attributes: { color: "Oatmeal", size: "Queen" } },
        { title: "Natural Oatmeal / King", sku: "TEX-LIN-001-NK", price: 265.0, stock: 5, attributes: { color: "Oatmeal", size: "King" } },
        { title: "Muted Terracotta / Queen", sku: "TEX-LIN-001-TQ", price: 235.0, stock: 4, attributes: { color: "Terracotta", size: "Queen" } },
      ],
    },
    {
      title: "Alpaca Wool Woven Throw Blanket",
      slug: "alpaca-wool-woven-throw-blanket",
      shortDescription: "Plush Peruvian baby alpaca fringe throw in warm camel tone.",
      description: "Incomparably soft and thermal without bulk. Ethically shorn and hand-finished by master Andean weavers.",
      price: 180.0,
      salePrice: null,
      costPrice: 70.0,
      sku: "TEX-ALP-002",
      stock: 24,
      isFeatured: true,
      categoryId: textiles.id,
      images: [
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Atlas Hand-Knotted Moroccan Wool Rug",
      slug: "atlas-hand-knotted-moroccan-wool-rug",
      shortDescription: "High-pile unbleached New Zealand wool area rug with charcoal geometric lines.",
      description: "Thick, deeply cushioned plush pile underfoot. Hand-knotted over 4 weeks by artisan collectives in the High Atlas Mountains.",
      price: 750.0,
      salePrice: 680.0,
      costPrice: 310.0,
      sku: "TEX-RUG-003",
      stock: 6,
      isFeatured: false,
      categoryId: textiles.id,
      images: [
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "5' x 8' Area", sku: "TEX-RUG-003-58", price: 680.0, stock: 4, attributes: { size: "5x8" } },
        { title: "8' x 10' Area", sku: "TEX-RUG-003-810", price: 980.0, stock: 2, attributes: { size: "8x10" } },
      ],
    },
    {
      title: "Waffle Weave Organic Cotton Bath Towel Set",
      slug: "waffle-weave-organic-cotton-bath-towel-set",
      shortDescription: "Quick-drying honeycomb waffle Turkish cotton bath sheets (Set of 2).",
      description: "Woven on jacquard looms from 100% GOTS certified Turkish Aegean cotton. High surface area ensures ultra-absorbency and fast drying.",
      price: 88.0,
      salePrice: null,
      costPrice: 32.0,
      sku: "TEX-TOW-004",
      stock: 35,
      isFeatured: false,
      categoryId: textiles.id,
      images: [
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },

    // Home Decor (4)
    {
      title: "Carrara Marble Sculptural Bookends",
      slug: "carrara-marble-sculptural-bookends",
      shortDescription: "Solid block Italian marble arches with non-scratch felt base (Pair).",
      description: "Honed from genuine Italian Bianco Carrara marble blocks. Weighing 3.8kg each, they effortlessly support heavy art anthologies while functioning as standalone sculptures.",
      price: 145.0,
      salePrice: 125.0,
      costPrice: 50.0,
      sku: "DEC-MAR-001",
      stock: 15,
      isFeatured: true,
      categoryId: decor.id,
      images: [
        "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Hand-Cast Solid Bronze Catchall Tray",
      slug: "hand-cast-solid-bronze-catchall-tray",
      shortDescription: "Heavy sand-cast metal tray for timepieces, jewelry, and desk essentials.",
      description: "Raw sand-cast bronze displaying tactile crystalline foundry textures. Each piece is hand-waxed with microcrystalline preservation wax.",
      price: 95.0,
      salePrice: null,
      costPrice: 34.0,
      sku: "DEC-BRO-002",
      stock: 26,
      isFeatured: false,
      categoryId: decor.id,
      images: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Hinoki Wood & Cast Iron Incense Burner",
      slug: "hinoki-wood-cast-iron-incense-burner",
      shortDescription: "Architectural incense holder with aromatic Japanese cypress base.",
      description: "Combines fragrant Japanese Hinoki timber with a raw matte cast iron ash trough. Holds both stick and cone incense with precision.",
      price: 68.0,
      salePrice: 58.0,
      costPrice: 24.0,
      sku: "DEC-INC-003",
      stock: 40,
      isFeatured: true,
      categoryId: decor.id,
      images: [
        "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
    {
      title: "Smoked Glass Arch Vessel Vase",
      slug: "smoked-glass-arch-vessel-vase",
      shortDescription: "Mouth-blown tinted glass vase with geometric aperture.",
      description: "Translucent smoked charcoal glass captures shifting sunlight throughout the day. Designed to showcase dried botanical grasses or sculptural single blooms.",
      price: 85.0,
      salePrice: null,
      costPrice: 30.0,
      sku: "DEC-VAS-004",
      stock: 22,
      isFeatured: false,
      categoryId: decor.id,
      images: [
        "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [],
    },
  ];

  for (const item of productsData) {
    const { images, variants, ...prod } = item;
    const createdProduct = await prisma.product.create({
      data: {
        ...prod,
        status: ProductStatus.PUBLISHED,
        images: {
          create: images.map((url, idx) => ({
            url,
            altText: `${prod.title} view ${idx + 1}`,
            sortOrder: idx,
            isPrimary: idx === 0,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            attributes: v.attributes,
          })),
        },
      },
    });

    // Add a high quality customer review for each featured product
    if (prod.isFeatured) {
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userId: customer.id,
          rating: 5,
          title: "Exceptional craftsmanship and tactile warmth",
          comment: `Purchased this piece for our dining room renovation. The materials and finishing are even more impressive in person than in the photography. Delivery was seamlessly packaged with zero plastic.`,
          status: "APPROVED",
          verifiedPurchase: true,
        },
      });
    }
  }

  console.log("Created 20 products with images, variants, and reviews.");

  // 5. Promotional Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off your first sanctuary order",
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10.0,
        minOrderValue: 50.0,
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: "SAVE50",
        description: "$50 off curated orders over $250",
        discountType: DiscountType.FIXED,
        discountValue: 50.0,
        minOrderValue: 250.0,
        usageLimit: 500,
        isActive: true,
      },
      {
        code: "AURA2026",
        description: "15% off seasonal collection",
        discountType: DiscountType.PERCENTAGE,
        discountValue: 15.0,
        minOrderValue: 100.0,
        usageLimit: 200,
        isActive: true,
      },
    ],
  });

  console.log("Created 3 active promotional coupons.");

  // 6. Homepage Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Artisanal Living & Timeless Craftsmanship",
        subtitle: "Warm minimalist furniture, atmospheric lighting, and hand-thrown stoneware crafted for modern sanctuaries.",
        imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
        linkUrl: "/products",
        badge: "Spring 2026 Collection",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "The Ceremony of Tea & Ceramics",
        subtitle: "Explore high-fired Japanese tableware and handcrafted teaware.",
        imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1600&q=85",
        linkUrl: "/categories/ceramics-dining",
        badge: "Featured Discipline",
        sortOrder: 2,
        isActive: true,
      },
    ],
  });

  console.log("Created homepage banners.");

  // 7. Store System Settings
  await prisma.setting.createMany({
    data: [
      { key: "store_name", value: "AURA Living", group: "GENERAL", description: "Public storefront name" },
      { key: "store_email", value: "concierge@auraliving.com", group: "GENERAL", description: "Customer contact email" },
      { key: "free_shipping_threshold", value: "150", group: "SHIPPING", description: "Cart value required for free shipping" },
      { key: "standard_shipping_rate", value: "15.00", group: "SHIPPING", description: "Flat shipping fee" },
      { key: "tax_rate_percent", value: "8.5", group: "TAX", description: "Default sales tax percentage" },
      { key: "currency", value: "USD", group: "PAYMENT", description: "Default currency code" },
      { key: "currency_symbol", value: "$", group: "PAYMENT", description: "Currency display symbol" },
    ],
  });

  // 8. Sample completed order for dashboard reporting
  const firstProduct = await prisma.product.findFirst({ where: { slug: "kyoto-solid-white-oak-lounge-chair" } });
  if (firstProduct) {
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: "AURA-2026-1001",
        userId: customer.id,
        status: "DELIVERED",
        subtotal: 620.0,
        taxTotal: 52.7,
        shippingTotal: 0.0,
        discountTotal: 0.0,
        grandTotal: 672.7,
        shippingCarrier: "FedEx Freight",
        trackingNumber: "FDX-9920148821",
        shippingDetails: {
          recipient: "Sophia Vance",
          street: "742 Evergreen Terrace, Suite 4B",
          city: "San Francisco",
          state: "CA",
          postalCode: "94107",
          country: "US",
        },
        items: {
          create: {
            productId: firstProduct.id,
            title: firstProduct.title,
            sku: firstProduct.sku,
            price: 620.0,
            quantity: 1,
            total: 620.0,
          },
        },
        payments: {
          create: {
            provider: "STRIPE",
            status: "COMPLETED",
            transactionId: "pi_demo_mock_stripe_9921",
            amount: 672.7,
          },
        },
      },
    });
    console.log("Created sample delivered order:", sampleOrder.orderNumber);
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
