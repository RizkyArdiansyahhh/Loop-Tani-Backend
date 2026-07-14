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
      storeSlug: 'tani-makmur-jaya',
      status: 'ACTIVE',
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
      storeSlug: 'kebun-segar-bu-siti',
      status: 'ACTIVE',
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

  // ── 3. Seed Knowledge Content ──────────────────────────────────────────────
  console.log('\n📚 Seeding knowledge contents...');
  
  const KNOWLEDGE_DATA = [
    {
      type: 'ARTICLE' as const,
      title: 'Cara Mengolah Jerami Padi Menjadi Briket Biomassa Bernilai Tinggi',
      slug: 'cara-olah-jerami-briket',
      content: 'Jerami padi sering kali hanya dibakar setelah masa panen selesai. Padahal, pembakaran jerami menghasilkan polusi udara yang merugikan kesehatan dan lingkungan sekitar. Salah satu solusi terbaik untuk memanfaatkan limbah ini adalah dengan mengolahnya menjadi briket biomassa. Briket dari jerami ini memiliki nilai kalori yang cukup tinggi dan dapat digunakan sebagai bahan bakar alternatif rumah tangga maupun industri kecil.\n\nProses pembuatan briket jerami padi terbilang mudah. Pertama-tama, jerami yang telah dikeringkan harus diarangkan (dikarbonisasi) terlebih dahulu menggunakan drum pembakaran dengan kondisi oksigen minimal. Pengarangan ini bertujuan untuk meningkatkan nilai kalor briket dan meminimalkan asap saat briket digunakan nanti.\n\nSetelah diperoleh arang jerami, haluskan arang tersebut hingga menjadi bubuk kasar. Campurkan bubuk arang jerami dengan perekat alami seperti tepung tapioka (kanji) yang sudah dilarutkan dalam air panas. Perbandingan yang disarankan adalah 90% arang jerami and 10% perekat tapioka. Aduk adonan hingga merata dan terasa liat.\n\nLangkah terakhir adalah pencetakan. Masukkan adonan ke dalam cetakan briket sederhana (bisa menggunakan pipa paralon bekas atau cetakan besi manual) lalu tekan dengan kuat agar padat. Jemur briket basah di bawah sinar matahari selama 2-3 hari hingga benar-benar kering dan keras. Briket jerami padi siap digunakan sebagai bahan bakar ramah lingkungan!',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&h=400&q=80',
      rewardPoint: 20,
      estimatedReadingMinutes: 5,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengenal Kompos TKKS (Tandan Kosong Kelapa Sawit) & Manfaat Tanah',
      slug: 'mengenal-kompos-tkks',
      content: 'Tandan Kosong Kelapa Sawit (TKKS) merupakan limbah padat terbesar yang dihasilkan oleh pabrik kelapa sawit. Jika dibiarkan menumpuk, limbah ini dapat menimbulkan bau tidak sedap serta menjadi sarang penyakit bagi tanaman kelapa sawit itu sendiri. Namun, melalui proses pengomposan yang tepat, TKKS dapat diubah menjadi pupuk organik bermutu tinggi yang sangat kaya akan unsur hara kalium.\n\nProses pengomposan TKKS biasanya dikombinasikan dengan limbah cair pabrik kelapa sawit (LCPKS) yang kaya akan nitrogen. Campuran kedua bahan organik ini akan mempercepat proses dekomposi mikroba karena memiliki rasio Karbon (C) dan Nitrogen (N) yang ideal. Bakteri pengurai akan bekerja aktif memecah bahan organik keras dalam TKKS menjadi senyawa tanah yang subur.\n\nManfaat utama penggunaan kompos TKKS adalah untuk memperbaiki struktur fisik tanah, meningkatkan kapasitas menahan air (water holding capacity), serta menyediakan unsur hara makro dan mikro bagi tanaman. Kompos ini sangat cocok diaplikasikan pada tanah berpasir atau lahan marginal yang kekurangan bahan organik aktif.\n\nUntuk menggunakannya, taburkan kompos TKKS secara merata di sekeliling piringan tanaman kelapa sawit atau campurkan ke dalam lubang tanam hortikultura. Dengan memanfaatkan TKKS secara sirkular, biaya pemupukan kimia dapat dipangkas hingga 30%, sekaligus meminimalkan dampak lingkungan negatif pabrik sawit.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&h=400&q=80',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID
    },
    {
      type: 'ARTICLE' as const,
      title: 'Panduan Perawatan Rutin Mesin Pencacah Rumput Petani Mandiri',
      slug: 'servis-mesin-pencacah-rumput',
      content: 'Mesin pencacah rumput atau chopper pakan ternak adalah investasi penting bagi peternak berskala menengah ke atas. Alat ini mempermudah proses pembuatan pakan silase maupun pencacahan rumput gajah harian. Namun, karena sering berhadapan dengan bahan berserat tinggi dan getah rumput yang lengket, mesin ini memerlukan perawatan ekstra agar kinerjanya tidak cepat menurun.\n\nSalah satu masalah utama yang sering dialami petani adalah pisau pencacah yang tumpul. Pisau yang tumpul akan membuat putaran mesin terasa berat, boros bahan bakar, dan hasil cacahan menjadi tidak merata. Disarankan untuk memeriksa ketajaman pisau setiap 20 jam penggunaan dan mengasahnya secara berkala menggunakan mesin gerinda tangan.\n\nSelain pisau, kebersihan ruang pencacah juga harus diperhatikan. Setiap kali selesai digunakan, bersihkan sisa-sisa rumput dan getah yang menempel pada dinding dalam mesin. Getah rumput yang mengering dan menumpuk dapat mengeras seperti semen, menyumbat saringan, serta memicu karat pada bagian logam sensitif mesin.\n\nJangan lupa untuk secara rutin memeriksa pelumasan pada bearing poros utama dan rantai transmisi motor penggerak. Gunakan gemuk (grease) tahan panas berkuaitas tinggi setiap bulan sekali. Perawatan sederhana dan disiplin ini dapat memperpanjang umur pakai chopper pakan ternak Anda hingga bertahun-tahun lamanya.',
      category: 'ALAT' as const,
      difficulty: 'MENENGAH' as const,
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&h=400&q=80',
      rewardPoint: 30,
      estimatedReadingMinutes: 6,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID
    },
    {
      type: 'VIDEO' as const,
      title: 'Langkah Praktis Membuat Briket Berkualitas dari Jerami Padi',
      slug: 'praktik-briket-jerami',
      content: 'Video ini mendemonstrasikan langkah demi langkah pembuatan briket biomassa dari jerami padi kering. Tonton detail proses pengarangan tanpa oksigen, penghalusan arang, pencampuran kanji, hingga teknik penekanan cetakan briket buatan sendiri.',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&h=400&q=80',
      rewardPoint: 30,
      videoDuration: 435,
      secureUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
      thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/dog.jpg',
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID
    },
    {
      type: 'VIDEO' as const,
      title: 'Proses Pengomposan Tandan Kosong Kelapa Sawit Secara Cepat',
      slug: 'proses-kompos-tkks',
      content: 'Pelajari rahasia pengomposan cepat limbah padat kelapa sawit (TKKS) menggunakan mikroba aktif. Video ini menunjukkan tata cara tumpukan windrow, penyiraman cairan probiotik, monitoring suhu, serta indikator fisik kompos matang.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&h=400&q=80',
      rewardPoint: 25,
      videoDuration: 342,
      secureUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
      thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/dog.jpg',
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID
    }
  ];

  let knowledgeCount = 0;
  for (const item of KNOWLEDGE_DATA) {
    const existing = await prisma.knowledgeContent.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`  ⏭️  Skipped (already exists): ${item.title}`);
      continue;
    }

    await prisma.knowledgeContent.create({
      data: item,
    });
    knowledgeCount++;
    console.log(`  ✅ [${item.type}] ${item.title}`);
  }

  console.log();
  console.log('─'.repeat(50));
  console.log(`✨ Seed complete!`);
  console.log(`   👤 Sellers  : 2`);
  console.log(`   📦 Products : ${productCount}`);
  console.log(`   📚 Knowledge: ${knowledgeCount}`);
  console.log('─'.repeat(50));

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
