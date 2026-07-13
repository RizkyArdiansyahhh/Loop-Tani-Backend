import 'dotenv/config';
import { PrismaClient, ProductStatus, ProductCondition, ProductCategory } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: slugify
// ─────────────────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed Data
// ─────────────────────────────────────────────────────────────────────────────

const SELLER_ID = 'seed-seller-001';
const SELLER_2_ID = 'seed-seller-002';

const PRODUCTS_DATA = [
  // ─── Processed Products (Produk Olahan) ────────────────────────────────────
  {
    category: ProductCategory.PROCESSED_PRODUCT,
    sellerId: SELLER_ID,
    title: 'Beras Merah Organik Premium',
    description:
      'Beras merah organik tanpa pestisida, ditanam secara alami di sawah dataran tinggi Jawa Tengah. Kaya serat dan nutrisi. Cocok untuk diet sehat.',
    price: 28000,
    stock: 200,
    condition: ProductCondition.NEW,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    province: 'Jawa Tengah',
    city: 'Semarang',
    sellerRating: 4.8,
    totalReview: 35,
    weight: 1000, // 1 kg
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=800', order: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=800', order: 2 },
    ],
  },
  {
    category: ProductCategory.PROCESSED_PRODUCT,
    sellerId: SELLER_2_ID,
    title: 'Beras Putih Pulen Cianjur',
    description:
      'Beras putih varietas IR64 dari Cianjur, terkenal dengan kepulenannya. Cocok untuk nasi putih sehari-hari.',
    price: 14000,
    stock: 500,
    condition: ProductCondition.NEW,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
    province: 'Jawa Barat',
    city: 'Cianjur',
    sellerRating: 4.6,
    totalReview: 82,
    weight: 1000, // 1 kg
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', order: 1 },
    ],
  },
  {
    category: ProductCategory.PROCESSED_PRODUCT,
    sellerId: SELLER_ID,
    title: 'Tomat Cherry Organik 500gr',
    description:
      'Tomat cherry segar ukuran kecil manis, ditanam organik tanpa bahan kimia sintetis. Ideal untuk salad and garnish.',
    price: 18000,
    stock: 60,
    condition: ProductCondition.NEW,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    sellerRating: 4.9,
    totalReview: 18,
    weight: 500, // 500g
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800', order: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1558818498-28c3e002b655?w=800', order: 2 },
    ],
  },
  {
    category: ProductCategory.PROCESSED_PRODUCT,
    sellerId: SELLER_2_ID,
    title: 'Jahe Merah Kering Giling 250gr',
    description:
      'Jahe merah kering digiling halus, cocok untuk wedang, minuman kesehatan, dan rempah masakan. Kaya antioksidan.',
    price: 22000,
    stock: 50,
    condition: ProductCondition.NEW,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
    province: 'Jawa Timur',
    city: 'Malang',
    sellerRating: 4.2,
    totalReview: 8,
    weight: 250, // 250g
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800', order: 1 },
    ],
  },

  // ─── Agricultural Waste (Limbah Pertanian) ──────────────────────────────────
  {
    category: ProductCategory.AGRICULTURAL_WASTE,
    sellerId: SELLER_2_ID,
    title: 'Sekam Padi Bersih 50kg (Karung)',
    description:
      'Sekam padi bersih hasil penggilingan padi, cocok sebagai media tanam, campuran kompos, atau bahan bakar biomassa.',
    price: 15000,
    stock: 80,
    condition: ProductCondition.NEW,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
    province: 'Jawa Barat',
    city: 'Karawang',
    sellerRating: 4.7,
    totalReview: 45,
    weight: 50000, // 50 kg
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800', order: 1 },
    ],
  },
  {
    category: ProductCategory.AGRICULTURAL_WASTE,
    sellerId: SELLER_ID,
    title: 'Jerami Padi Kering Pakan Ternak',
    description:
      'Jerami padi kering, bisa digunakan sebagai pakan ternak, mulsa tanaman, atau bahan kerajinan tangan.',
    price: 5000,
    stock: 200,
    condition: ProductCondition.NEW,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
    province: 'Jawa Tengah',
    city: 'Sragen',
    sellerRating: 4.4,
    totalReview: 12,
    weight: 10000, // 10 kg
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=800', order: 1 },
    ],
  },
  {
    category: ProductCategory.AGRICULTURAL_WASTE,
    sellerId: SELLER_ID,
    title: 'Pupuk Kompos Organik Matang 25kg',
    description:
      'Pupuk kompos organik matang dari fermentasi bahan organik alami, kaya humus dan mikroba tanah. Meningkatkan kesuburan lahan pertanian.',
    price: 55000,
    stock: 40,
    condition: ProductCondition.NEW,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    province: 'DI Yogyakarta',
    city: 'Sleman',
    sellerRating: 4.8,
    totalReview: 29,
    weight: 25000, // 25 kg
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800', order: 1 },
    ],
  },

  // ─── Secondhand (Alat Secondhand) ──────────────────────────────────────────
  {
    category: ProductCategory.SECONDHAND,
    sellerId: SELLER_2_ID,
    title: 'Traktor Tangan Quick G1000 Second',
    description:
      'Traktor tangan merk Quick G1000 bekas pemakaian 2 tahun. Kondisi mesin diesel Kubota 8.5 HP masih sangat prima. Siap pakai bajak sawah.',
    price: 9500000,
    stock: 1,
    condition: ProductCondition.USED,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    province: 'Jawa Timur',
    city: 'Nganjuk',
    sellerRating: 4.5,
    totalReview: 4,
    weight: 150000, // 150 kg
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?w=800', order: 1 },
    ],
  },
  {
    category: ProductCategory.SECONDHAND,
    sellerId: SELLER_ID,
    title: 'Gunting Dahan Tanaman Ranting Tarik',
    description:
      'Gunting tarik pemangkas ranting pohon tinggi, kondisi bekas tapi pisau pemotong masih tajam. Panjang galah bisa diatur.',
    price: 120000,
    stock: 3,
    condition: ProductCondition.USED,
    status: ProductStatus.ACTIVE,
    isFeatured: false,
    province: 'Jawa Tengah',
    city: 'Semarang',
    sellerRating: 4.3,
    totalReview: 15,
    weight: 1500, // 1.5 kg
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1508780709619-7956203a4647?w=800', order: 1 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Seed Function
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  console.log('🌱 Starting seed...\n');

  // ── 1. Upsert Seller Users ──────────────────────────────────────────────────
  console.log('👤 Seeding sellers...');

  const now = new Date();

  const seller1 = await prisma.user.upsert({
    where: { id: SELLER_ID },
    update: {},
    create: {
      id: SELLER_ID,
      name: 'Budi Santoso',
      email: 'budi.tani@looptani.id',
      emailVerified: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { id: SELLER_2_ID },
    update: {},
    create: {
      id: SELLER_2_ID,
      name: 'Siti Rahayu',
      email: 'siti.kebun@looptani.id',
      emailVerified: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  // Assign SELLER role
  await prisma.userRole.upsert({
    where: { userId_role: { userId: SELLER_ID, role: 'SELLER' } },
    update: {},
    create: { userId: SELLER_ID, role: 'SELLER' },
  });

  await prisma.userRole.upsert({
    where: { userId_role: { userId: SELLER_2_ID, role: 'SELLER' } },
    update: {},
    create: { userId: SELLER_2_ID, role: 'SELLER' },
  });

  // Seller profiles
  await prisma.sellerProfile.upsert({
    where: { userId: SELLER_ID },
    update: {},
    create: {
      userId: SELLER_ID,
      storeName: 'Tani Makmur Jaya',
      description: 'Petani organik berpengalaman dari Jawa Tengah',
      address: 'Jl. Sawah Indah No. 12, Semarang',
    },
  });

  await prisma.sellerProfile.upsert({
    where: { userId: SELLER_2_ID },
    update: {},
    create: {
      userId: SELLER_2_ID,
      storeName: 'Kebun Segar Bu Siti',
      description: 'Sayur dan buah segar langsung dari kebun',
      address: 'Jl. Kebun Raya No. 45, Bogor',
    },
  });

  console.log(`  ✅ ${seller1.name} (${seller1.email})`);
  console.log(`  ✅ ${seller2.name} (${seller2.email})\n`);

  // ── 2. Seed Products ────────────────────────────────────────────────────────
  console.log('📦 Seeding products...');

  let productCount = 0;

  for (const product of PRODUCTS_DATA) {
    const slug = slugify(product.title);

    // Check if product with this slug already exists
    const existing = await prisma.product.findFirst({ where: { slug } });
    if (existing) {
      console.log(`  ⏭️  Skipped (already exists): ${product.title}`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        sellerId: product.sellerId,
        category: product.category,
        title: product.title,
        slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        condition: product.condition,
        status: product.status,
        isFeatured: product.isFeatured,
        province: product.province,
        city: product.city,
        sellerRating: product.sellerRating,
        totalReview: product.totalReview,
        weight: product.weight,
        images: {
          createMany: {
            data: product.images,
          },
        },
      },
    });

    // Seed some favorites for testing
    // Seller 1 favorites Seller 2's products, Seller 2 favorites Seller 1's products
    if (product.sellerId === SELLER_ID) {
      await prisma.productFavorite.create({
        data: {
          userId: SELLER_2_ID,
          productId: createdProduct.id,
        },
      });
    } else {
      await prisma.productFavorite.create({
        data: {
          userId: SELLER_ID,
          productId: createdProduct.id,
        },
      });
    }

    productCount++;
    const featured = product.isFeatured ? ' ⭐' : '';
    console.log(`  ✅ [${product.status}]${featured} ${product.title} — Rp${product.price.toLocaleString('id-ID')} (${product.category})`);
  }

  console.log();
  console.log('─'.repeat(50));
  console.log(`✨ Seed complete!`);
  console.log(`   👤 Sellers  : 2`);
  console.log(`   📦 Products : ${productCount}`);
  console.log('─'.repeat(50));

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
