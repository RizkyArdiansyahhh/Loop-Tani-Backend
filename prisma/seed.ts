import 'dotenv/config';
import { PrismaClient, ProductCategory, ProductCondition, ProductStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { auth } from '../src/infra/auth/auth';
import { seedRegions } from './seeders/region.seed';

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

  // ── 0. Seed Region Master Data ──────────────────────────────────────────────
  await seedRegions(prisma as any);

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
    update: {
      description: 'Sentra komoditas hasil tani, olahan limbah & mesin pertanian terpercaya dari Sumatera',
      address: 'Jl. Sisingamangaraja No. 12, Medan, Sumatera Utara',
    },
    create: {
      userId: SELLER_ID,
      storeName: 'Tani Makmur Jaya',
      storeSlug: 'tani-makmur-jaya',
      status: 'ACTIVE',
      description: 'Sentra komoditas hasil tani, olahan limbah & mesin pertanian terpercaya dari Sumatera',
      address: 'Jl. Sisingamangaraja No. 12, Medan, Sumatera Utara',
    },
  });

  await prisma.sellerProfile.upsert({
    where: { userId: SELLER_2_ID },
    update: {
      description: 'Penyedia produk olahan tani, pupuk organik, dan alat kebun dari Sumatera',
      address: 'Jl. Jenderal Sudirman No. 45, Pekanbaru, Riau',
    },
    create: {
      userId: SELLER_2_ID,
      storeName: 'Kebun Segar Bu Siti',
      storeSlug: 'kebun-segar-bu-siti',
      status: 'ACTIVE',
      description: 'Penyedia produk olahan tani, pupuk organik, dan alat kebun dari Sumatera',
      address: 'Jl. Jenderal Sudirman No. 45, Pekanbaru, Riau',
    },
  });

  console.log(`  ✅ ${seller1.name} (${seller1.email})`);
  console.log(`  ✅ ${seller2.name} (${seller2.email})\n`);

  // ── 2. Seed Products ────────────────────────────────────────────────────────
  console.log('📦 Seeding products...');

  const PRODUCTS_DATA = [
    // ── Kategori: LIMBAH PERTANIAN (AGRICULTURAL_WASTE) dari Foto Google Drive ──
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_ID,
      title: 'Cangkang Kelapa Sawit Kering Grade A (Palm Kernel Shell)',
      description:
        'Cangkang kelapa sawit (PKS) kering kualitas ekspor dengan kadar air rendah (<15%) dan nilai kalor tinggi hingga 4.200 kkal/kg. Sangat ideal sebagai bahan bakar biomassa boiler pabrik, bahan baku arang aktif, dan briket ramah lingkungan.',
      price: 65000,
      stock: 150,
      unit: 'kg',
      weight: 50000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Riau',
      city: 'Pekanbaru',
      sellerRating: 4.9,
      totalReview: 38,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489985/loop-tani/products/limbah/cangkang_sawit_1.png',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489986/loop-tani/products/limbah/cangkang_sawit_2.jpg',
          order: 1,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_ID,
      title: 'Tandan Kosong Kelapa Sawit (TKKS) Cacah Organik',
      description:
        'Limbah tandan kosong kelapa sawit yang telah dicacah rapi, kaya unsur hara Kalium (K) dan bahan organik. Sangat cocok untuk bahan baku pupuk kompos organik sawit, mulsa penutup tanah piringan pohon, serta media tanam budidaya jamur merang.',
      price: 25000,
      stock: 80,
      unit: 'kg',
      weight: 20000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Utara',
      city: 'Deli Serdang',
      sellerRating: 4.8,
      totalReview: 22,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489987/loop-tani/products/limbah/tandan_kosong_sawit.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_2_ID,
      title: 'Limbah Kulit Nanas Segar Pakan Ternak & Eco-Enzyme',
      description:
        'Kulit nanas segar hasil sortiran industri buah nanas. Memiliki kadar gula alami tinggi, vitamin C, dan serat fermentatif yang sangat disukai ternak ruminansia (sapi, domba, kambing) untuk meningkatkan nafsu makan dan bobot badan. Sangat cocok juga untuk bahan pembuatan cairan eco-enzyme pembersih alami.',
      price: 18000,
      stock: 60,
      unit: 'kg',
      weight: 15000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Lampung',
      city: 'Lampung Tengah',
      sellerRating: 4.7,
      totalReview: 19,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489989/loop-tani/products/limbah/kulit_nanas_1.png',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489990/loop-tani/products/limbah/kulit_nanas_2.jpg',
          order: 1,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_2_ID,
      title: 'Limbah Kulit & Cangkang Biji Kakao Kering (Cocoa Shell Mulch)',
      description:
        'Cangkang kulit ari biji kakao dan kulit buah kakao kering pilihan. Memiliki aroma cokelat alami khas yang harum, kaya nitrogen dan kalium. Berfungsi sebagai mulsa dekoratif tanaman hias/kebun yang efektif mencegah gulma, menjaga kelembaban tanah, serta bahan pengomposan kaya nutrisi.',
      price: 35000,
      stock: 50,
      unit: 'kg',
      weight: 10000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Aceh',
      city: 'Pidie Jaya',
      sellerRating: 4.8,
      totalReview: 14,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489991/loop-tani/products/limbah/kakao_shells_mulch.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489992/loop-tani/products/limbah/kakao_husks.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489994/loop-tani/products/limbah/kakao_pods.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_ID,
      title: 'Kulit Ari Biji Kakao Kering Bersih (Bahan Baku Teh Cacao Husk)',
      description:
        'Limbah bernilai tinggi berupa kulit ari (husk) dari proses sangrai biji cokelat fermentasi. Bersih, higienis, dan beraroma cokelat murni pekat. Sangat dicari untuk bahan baku upcycling teh seduhan kakao, ekstrak antioksidan theobromine herbal, serta aroma terapi alami.',
      price: 25000,
      stock: 70,
      unit: 'kg',
      weight: 1000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Barat',
      city: 'Padang Pariaman',
      sellerRating: 4.9,
      totalReview: 28,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489996/loop-tani/products/limbah/kakao_tea.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_ID,
      title: 'Bekatul Padi Murni (Dedak Halus) Pakan Ternak Super',
      description:
        'Bekatul padi murni super halus hasil mesin polisher penggilingan padi modern tanpa sekam kasar. Mengandung lemak nabati, karbohidrat, dan vitamin B kompleks tinggi. Pilihan utama peternak untuk penggemukan unggas (ayam/bebek) dan pengental ransum sapi perah.',
      price: 40000,
      stock: 120,
      unit: 'kg',
      weight: 10000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Utara',
      city: 'Serdang Bedagai',
      sellerRating: 4.8,
      totalReview: 41,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489997/loop-tani/products/limbah/bekatul_padi.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_2_ID,
      title: 'Sekam Padi Mentah Kering Bersih (Media Tanam & Biomassa)',
      description:
        'Sekam padi mentah (kulit gabah kering) hasil gilingan baru yang bersih dan kering. Sangat bagus untuk porositas media tanam hidroponik/pot, campuran pupuk kandang, alas kandang unggas, serta bahan pembuatan arang sekam bakar (biochar).',
      price: 15000,
      stock: 200,
      unit: 'karung',
      weight: 10000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Aceh',
      city: 'Aceh Besar',
      sellerRating: 4.7,
      totalReview: 53,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489998/loop-tani/products/limbah/sekam_padi.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_ID,
      title: 'Tongkol Jagung (Janggel) Kering Cacah untuk Pakan & Jamur',
      description:
        'Limbah tongkol jagung (janggel) kering hasil pipil jagung hibrida yang telah dicacah sedang. Sangat baik digunakan sebagai media budidaya jamur janggel jagung lezat bernilai ekonomi tinggi, bahan campuran silase pakan ternak kambing/sapi, dan briket arang biomassa.',
      price: 30000,
      stock: 90,
      unit: 'kg',
      weight: 20000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Lampung',
      city: 'Lampung Selatan',
      sellerRating: 4.6,
      totalReview: 17,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789489999/loop-tani/products/limbah/tongkol_jagung.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.AGRICULTURAL_WASTE,
      sellerId: SELLER_2_ID,
      title: 'Batang Kayu Singkong Kering (Limbah Kayu Biomassa & Stek)',
      description:
        'Potongan batang kayu ubi singkong pasca panen umbi. Memiliki struktur kayu kering berserat yang cocok untuk bahan bakar biomassa tungku kayu, arang karbonisasi, serta bibit stek ubi kayu varietas tahan kekeringan.',
      price: 20000,
      stock: 80,
      unit: 'ikat',
      weight: 15000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Lampung',
      city: 'Lampung Timur',
      sellerRating: 4.5,
      totalReview: 12,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789490001/loop-tani/products/limbah/batang_singkong.jpg',
          order: 0,
        },
      ],
    },
    // ── Kategori: PRODUK OLAHAN (PROCESSED_PRODUCT) dari Foto Google Drive ──
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_ID,
      title: 'Cocopeat Curah Organik Steril (Media Tanam Sabut Kelapa Siap Pakai)',
      description:
        'Media tanam cocopeat steril hasil pengolahan sabut kelapa yang telah dicuci bersih (Low EC, bebas zat tanin) dan diayak halus. Memiliki kemampuan menahan air hingga 8x bobot kering dan aerasi optimal untuk perakaran. Sangat cocok untuk semai benih, perbanyakan stek, media tanam hidroponik, dan campuran tanah pot bunga/sayuran.',
      price: 22000,
      stock: 180,
      unit: 'karung',
      weight: 10000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Riau',
      city: 'Kampar',
      sellerRating: 4.9,
      totalReview: 64,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493196/loop-tani/products/olahan/cocopeat_powder_1.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493199/loop-tani/products/olahan/cocopeat_curah_2.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493204/loop-tani/products/olahan/cocopeat_manure_3.png',
          order: 2,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493211/loop-tani/products/olahan/cocopeat_pupuk_4.jpg',
          order: 3,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_2_ID,
      title: 'Tali Sabut Kelapa Alami (Coir Rope) Rambatan & Turus 50m',
      description:
        'Tali tambang alami ramah lingkungan hasil pintalan serat sabut kelapa (coco fiber) pilihan. Kuat, lentur, tahan terhadap paparan cuaca luar ruangan, dan tidak melukai batang tanaman. Sangat ideal untuk tali rambatan tanaman merambat (vanili, sirih, anggur, monstera), pembuatan turus lumut, dan kerajinan tangan estetik.',
      price: 35000,
      stock: 90,
      unit: 'roll',
      weight: 1200,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Barat',
      city: 'Padang Pariaman',
      sellerRating: 4.8,
      totalReview: 26,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493212/loop-tani/products/olahan/tali_sabut_kelapa.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_ID,
      title: 'Briket Bio-Arang Kubus Sekam Padi (Bahan Bakar BBQ & Shisha)',
      description:
        'Briket arang kubus padat hasil karbonisasi pirolisis sekam padi murni dengan perekat tapioka alami tanpa bahan kimia sintetis. Memiliki suhu bara api tinggi dan stabil, waktu pembakaran awet hingga 2,5 jam, tidak meletup, dan menghasilkan abu putih yang sangat minim.',
      price: 18000,
      stock: 150,
      unit: 'kg',
      weight: 1000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Sumatera Utara',
      city: 'Langkat',
      sellerRating: 4.8,
      totalReview: 42,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493213/loop-tani/products/olahan/briket_arang_sekam.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_2_ID,
      title: 'Briket Pelet Biomassa Jerami Padi (Straw Pellets Eco-Fuel 15kg)',
      description:
        'Pelet biomassa padat terbarukan hasil densifikasi limbah jerami padi giling. Memiliki kalori panas tinggi (+- 4.100 kkal/kg), ramah lingkungan, dan minim asap. Alternatif bahan bakar efisien untuk pemanas kandang ayam unggas (brooder), tungku pengeringan gabah/jagung, dan kompor biomassa pedesaan.',
      price: 45000,
      stock: 100,
      unit: 'karung',
      weight: 15000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Selatan',
      city: 'Ogan Ilir',
      sellerRating: 4.7,
      totalReview: 18,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493215/loop-tani/products/olahan/briket_pelet_jerami_1.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493219/loop-tani/products/olahan/biocarbon_pellets_2.jpg',
          order: 1,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_ID,
      title: 'Pakan Silase Fermentasi Jerami Padi (Pakan Sapi & Kambing Hemat 25kg)',
      description:
        'Pakan olahan komplit siap saji dari cacahan jerami padi segar yang difermentasikan bersama tetes tebu (molase), bekatul, dan probiotik anaerobik. Beraroma wangi tape yang sangat disukai ternak ruminansia, tekstur empuk, serta meningkatkan bobot harian sapi potong dan produksi susu sapi perah.',
      price: 55000,
      stock: 70,
      unit: 'karung',
      weight: 25000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Sumatera Utara',
      city: 'Deli Serdang',
      sellerRating: 4.9,
      totalReview: 51,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493221/loop-tani/products/olahan/pakan_jerami_fermentasi_1.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493225/loop-tani/products/olahan/pakan_jerami_fermentasi_2.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493228/loop-tani/products/olahan/pakan_jerami_fermentasi_3.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_2_ID,
      title: 'Pupuk Kompos Organik Matang Bio-Compost Plus (Kaya Humus 20kg)',
      description:
        'Pupuk kompos organik matang sempurna dari fermentasi biomassa pertanian dan kotoran ternak dengan bioaktivator EM4. Bertekstur remah hitam, tidak berbau busuk, kaya unsur hara makro-mikro alami dan asam humat. Berfungsi memperbaiki biologi tanah, menaikkan pH tanah masam, dan merangsang perakaran tanaman sayur/buah.',
      price: 35000,
      stock: 120,
      unit: 'karung',
      weight: 20000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Jambi',
      city: 'Kota Jambi',
      sellerRating: 4.8,
      totalReview: 37,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493230/loop-tani/products/olahan/pupuk_kompos_ecocell_1.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493232/loop-tani/products/olahan/pupuk_kompos_organik_2.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493237/loop-tani/products/olahan/pupuk_kompos_kandang_3.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_ID,
      title: 'Media Tanam Subur Top Soil Tanah Hitam Alami (Siap Pakai 15kg)',
      description:
        'Lapisan tanah atas (top soil) murni kaya bahan organik alami yang sudah disaring dari batu dan kerikil. Gembur, berpori, dan menahan kelembaban dengan baik. Siap digunakan langsung untuk media tanam pot, polybag, bedengan sayuran hijau, cabai, dan tanaman hias perumahan.',
      price: 25000,
      stock: 140,
      unit: 'karung',
      weight: 15000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Aceh',
      city: 'Aceh Besar',
      sellerRating: 4.7,
      totalReview: 29,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493240/loop-tani/products/olahan/topsoil_tanah_hitam.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_ID,
      title: 'Pupuk Sawit Terpadu MPOB F4 Formulasi 3-in-1 Plus Zeolite (25kg)',
      description:
        'Pupuk sawit olahan berkualitas dan seimbang berbasis formula riset MPOB F4 (Kombinasi Hara Kimia N:9 P2O5:6 K2O:18 MgO:2 B2O3:0.5 + Bahan Organik + Zeolite slow release). Memaksimalkan serapan hara di lahan gambut dan mineral, merangsang pembentukan tandan buah segar (TBS), serta meningkatkan rendemen minyak sawit.',
      price: 285000,
      stock: 40,
      unit: 'sak',
      weight: 25000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Riau',
      city: 'Pekanbaru',
      sellerRating: 4.9,
      totalReview: 45,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493243/loop-tani/products/olahan/pupuk_mpob_f4_sawit.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.PROCESSED_PRODUCT,
      sellerId: SELLER_2_ID,
      title: 'Pupuk Bio-Organik RealStrong Serbaguna Durian, Sayur & Buah (25kg)',
      description:
        'Inovasi pupuk terpadu Kimia + Mikroorganisme Aktif + Bahan Organik dengan Asam Humat 7% dan SOP bebas klorida. Memperbaiki ekosistem mikroba tanah, mencegah penyakit layu akar, memicu pembungaan serempak, dan mempermanis rasa buah durian, semangka, melon, serta sayuran daun.',
      price: 260000,
      stock: 50,
      unit: 'sak',
      weight: 25000,
      condition: ProductCondition.NEW,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Sumatera Utara',
      city: 'Medan',
      sellerRating: 4.9,
      totalReview: 33,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493245/loop-tani/products/olahan/pupuk_realstrong_organik.jpg',
          order: 0,
        },
      ],
    },
    // ── Kategori: ALAT & MESIN PERTANIAN BEKAS (SECONDHAND) dari Foto Google Drive ──
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Traktor Roda Empat 4WD Bekas Siap Kerja (Mesin Diesel Tangguh Lahan Luas)',
      description:
        'Traktor pertanian roda empat 4WD bekas kondisi siap kerja lapangan. Dilengkapi mesin diesel bertenaga besar, gardan 4x4 responsif, power steering enteng, sistem hidrolik bajak lancar, dan ban pacul tapak tebal. Sangat cocok untuk pengolahan tanah sawah bukaan besar, perkebunan jagung, tebu, maupun singkong. Sudah diservis ganti oli mesin dan siap kirim.',
      price: 52000000,
      stock: 1,
      unit: 'unit',
      weight: 1800000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Lampung',
      city: 'Tulang Bawang',
      sellerRating: 4.8,
      totalReview: 7,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493824/loop-tani/products/secondhand/secondhand_03_5724_s_4wd_154284_1702878543_0.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493839/loop-tani/products/secondhand/secondhand_15_balwan_400_64308_1642916251_0_.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493873/loop-tani/products/secondhand/secondhand_43_vt180d_jai_125274_1682130939_1.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Mesin Pemanen Padi Combine Harvester Kubota DC Series Secondhand (Siap Sawah)',
      description:
        'Mesin combine harvester pemanen padi otomatis bekas pemakaian kelompok tani. Sistem potong, perontok gabah, dan blower pembersih gabah bekerja sangat halus dan minim susut gabah (losses rendah). Menggunakan roda rantai karet (crawler track) yang stabil di lumpur dalam sawah basah. Mesin diesel halus terawat dan siap operasional musim panen.',
      price: 78000000,
      stock: 1,
      unit: 'unit',
      weight: 2400000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Aceh',
      city: 'Pidie',
      sellerRating: 4.9,
      totalReview: 9,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493845/loop-tani/products/secondhand/secondhand_21_e805bb86da87ee688add03108f4ef9.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493844/loop-tani/products/secondhand/secondhand_20_e680c6db0c3e61cb7f025dad2e2ecd.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493833/loop-tani/products/secondhand/secondhand_11_Sell_harvester_product_1636601.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Traktor Tangan Quick Kubota RD 85 DI Secondhand (Kondisi Prima Siap Bajak Singkal & Rotary)',
      description:
        'Traktor tangan bajak sawah merk Quick bermesin diesel Kubota RD 85 DI original. Kondisi cat rapi, kompresi diesel padat, tarikan engkol enteng, transmisi perseneling normal maju-mundur, v-belt baru. Sudah komplit dengan kelengkapan roda besi sawah, roda karet jalan, bajak singkal, dan garu perata lumpur.',
      price: 11500000,
      stock: 2,
      unit: 'unit',
      weight: 280000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Sumatera Utara',
      city: 'Deli Serdang',
      sellerRating: 4.7,
      totalReview: 14,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493843/loop-tani/products/secondhand/secondhand_19_e677d080cf1a9992dcc6935def8745.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493863/loop-tani/products/secondhand/secondhand_34_kubota_tangan_1740010523_6396b.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493834/loop-tani/products/secondhand/secondhand_12_WhatsApp_Image_2018_07_09_at_2.jpg',
          order: 2,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493865/loop-tani/products/secondhand/secondhand_35_maxresdefault__2__jpg.jpg',
          order: 3,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493866/loop-tani/products/secondhand/secondhand_36_maxresdefault__3__jpg.jpg',
          order: 4,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Traktor Tangan Rotary Cultivator Lahan Kering & Basah Bekas (Mesin Diesel Kuat)',
      description:
        'Traktor tangan dengan attachment rotary pencacah tanah bekas pemakaian perkebunan hortikultura. Pisau rotary tajam dan tebal, sangat efisien untuk menggemburkan bedengan sayuran, mencacah sisa gulma, serta mengaduk pupuk kandang langsung di lahan bedeng pertanian.',
      price: 8800000,
      stock: 1,
      unit: 'unit',
      weight: 230000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Aceh',
      city: 'Bireuen',
      sellerRating: 4.6,
      totalReview: 8,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493821/loop-tani/products/secondhand/secondhand_01_22796c60817c2ed5071a70dbd85cde.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493851/loop-tani/products/secondhand/secondhand_25_id_11134207_7r98p_lwxs301i7g8t.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493852/loop-tani/products/secondhand/secondhand_26_id_11134207_7r98w_m0cu5ynfu5q6.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Mesin Mini Tiller Cultivator Kebun Bensin Second (Hand Tiller Praktis Lahan Sayuran)',
      description:
        'Mini tiller / cultivator bensin ringkas merk SSK Japan Technology kondisi seken terawat. Mesin 4-tak 7 HP gampang distarter, konsumsi bensin irit, bobot lincah mudah bermanuver di sela-sela bedengan cabe, bawang merah, sayuran dataran tinggi, dan tanaman pekarangan.',
      price: 3400000,
      stock: 2,
      unit: 'unit',
      weight: 65000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Utara',
      city: 'Karo',
      sellerRating: 4.8,
      totalReview: 11,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493841/loop-tani/products/secondhand/secondhand_17_d_jpeg.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Mesin Giling Padi Rice Huller Pemecah Kulit Gabah Secondhand (Kapasitas Penggilingan Beras)',
      description:
        'Mesin pecah kulit gabah (rice huller) kapasitas besar untuk usaha selep gabah dan penggilingan padi desa. Rangka besi tebal kokoh, karet roll huller masih tebal, blower pemisah sekam berfungsi optimal menghasilkan beras pecah kulit bersih dari debu dan dedak kasar.',
      price: 6800000,
      stock: 1,
      unit: 'unit',
      weight: 350000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Sumatera Barat',
      city: 'Tanah Datar',
      sellerRating: 4.8,
      totalReview: 16,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493836/loop-tani/products/secondhand/secondhand_13_automatic_rice_huller_with_pol.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493867/loop-tani/products/secondhand/secondhand_37_mesin_selep_gabah_jpg.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493869/loop-tani/products/secondhand/secondhand_39_rice_huller_01_1515138848_p_35.jpg',
          order: 2,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493822/loop-tani/products/secondhand/secondhand_02_265abc0aadfe6a7681e244c78643e8.jpg',
          order: 3,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Mesin Selep Padi & Polisher Beras Mini Komplit Mesin Penggerak Bekas (Mahkota & Tiger)',
      description:
        'Mesin giling padi mini dan pemoles beras (rice polisher) lengkap dengan mesin penggerak bensin 7.5 HP siap pakai. Sangat praktis untuk petani mandiri yang ingin memproses gabah panen sendiri menjadi beras putih bersih tanpa perlu antre di pabrik penggilingan besar.',
      price: 4200000,
      stock: 2,
      unit: 'unit',
      weight: 120000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Utara',
      city: 'Simalungun',
      sellerRating: 4.7,
      totalReview: 13,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493870/loop-tani/products/secondhand/secondhand_40_sg_11134201_22120_m12m6u178clv.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493856/loop-tani/products/secondhand/secondhand_29_id_11134207_7rbk8_m9bfkhw21o29.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493853/loop-tani/products/secondhand/secondhand_27_id_11134207_7r98x_ll4sdeq3d3zd.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Mesin Huller Pengupas Kulit Tanduk & Kopi Kering Secondhand (King Huller Rangka Baja)',
      description:
        'Mesin pengupas kulit tanduk kopi (dry coffee huller) merk King Indonesia kondisi bekas pemakaian kebun kopi Gayo. Mampu mengupas kulit kopi kering dengan cepat, biji kopi utuh tidak pecah, corong pembuangan kulit bersih, dan dudukan mesin penggerak sudah disiapkan.',
      price: 3900000,
      stock: 1,
      unit: 'unit',
      weight: 95000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Aceh',
      city: 'Aceh Tengah',
      sellerRating: 4.9,
      totalReview: 6,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493872/loop-tani/products/secondhand/secondhand_42_sg_11134275_8225t_mhj6u3jbmtxg.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Mesin Chopper Pencacah Rumput Gajah & Tebon Jagung Pakan Silase Bekas (Bensin 7 HP)',
      description:
        'Mesin chopper pencacah rumput multifungsi rangka besi kokoh komplit mesin bensin 7 HP. Dilengkapi pisau baja HSS tajam untuk mencacah rumput odot, rumput gajah, batang singkong, tebon jagung, dan jerami untuk bahan silase fermentasi pakan ternak sapi/kambing.',
      price: 1750000,
      stock: 3,
      unit: 'unit',
      weight: 75000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Jambi',
      city: 'Muaro Jambi',
      sellerRating: 4.8,
      totalReview: 22,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493855/loop-tani/products/secondhand/secondhand_28_id_11134207_7rasa_m2khiu5c6v9t.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493825/loop-tani/products/secondhand/secondhand_04_7c7b02047d469a2d7dd34e2b665e6f.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493848/loop-tani/products/secondhand/secondhand_23_g_jpeg.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Mesin Cacah Jerami Padi & Chaff Cutter Pakan Ternak / Kompos Second (Chasis Roda)',
      description:
        'Mesin pencacah jerami dan limbah hijauan sistem rol tarik (chaff cutter) bekas. Dilengkapi roda dorong yang memudahkan mobilitas berpindah di sekitar kandang ternak atau lokasi pembuatan kompos organik. Suara mesin halus dan potongannya seragam.',
      price: 1350000,
      stock: 2,
      unit: 'unit',
      weight: 60000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Jambi',
      city: 'Batanghari',
      sellerRating: 4.7,
      totalReview: 15,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493826/loop-tani/products/secondhand/secondhand_05_8002f958d448bb4b2da9d5f4bcdc4d.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493859/loop-tani/products/secondhand/secondhand_31_id_11134207_81zth_me8oss5f29kw.jpg',
          order: 1,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Mesin Rotary Komposter Drum Putar Kapasitas 1200 Liter Second (Pengolah Kompos Organik)',
      description:
        'Mesin pengomposan drum putar rotary komposter RKE 1200L ex-proyek percontohan kelompok tani. Mempercepat proses aerasi fermentasi limbah organik pertanian, kotoran hewan, dan daun kering menjadi pupuk kompos matang dalam hitungan hari. Drum berputar lancar dengan sistem gearbox kokoh.',
      price: 14500000,
      stock: 1,
      unit: 'unit',
      weight: 220000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Riau',
      city: 'Siak',
      sellerRating: 4.9,
      totalReview: 5,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493828/loop-tani/products/secondhand/secondhand_07_Mesin_Kompos_RKE_1200_L_10_jpe.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Mesin Pompa Air Irigasi Sawah Alkon 2 Inchi Bensin Secondhand (Semburan Kencang)',
      description:
        'Mesin pompa air sawah (water pump alkon) diameter lubang 2 inch merk Spartans / Supra bertenaga bensin. Daya hisap kuat hingga 7 meter dan dorong vertikal 26 meter, sangat cocok untuk menyedot air sungai atau sumur dangkal untuk mengairi petak sawah padi di musim kemarau.',
      price: 850000,
      stock: 4,
      unit: 'unit',
      weight: 25000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Selatan',
      city: 'Banyuasin',
      sellerRating: 4.6,
      totalReview: 18,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493832/loop-tani/products/secondhand/secondhand_10_Sc2d49c51f512439daf69b4cc90a57.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493858/loop-tani/products/secondhand/secondhand_30_id_11134207_7rbk9_m78tfh6cf67b.jpg',
          order: 1,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Tangki Sprayer Elektrik Pertanian Gendong 16L - 18L Baterai Second (Solo & Nagoya Series)',
      description:
        'Alat semprot punggung elektrik (tangki sprayer baterai aki kering) kapasitas 16 s/d 18 liter second siap pakai. Pompa diafragma otomatis hidup mati saat tuas nozzle ditekan, semprotan kabut halus merata. Sudah termasuk charger aki, stik stainless teleskopik, kran pencet, dan 3 jenis nozzle semprot.',
      price: 265000,
      stock: 5,
      unit: 'unit',
      weight: 6000,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      province: 'Sumatera Utara',
      city: 'Medan',
      sellerRating: 4.8,
      totalReview: 31,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493838/loop-tani/products/secondhand/secondhand_14_b3c53a2eaa21bc8da6059bfab9916c.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493862/loop-tani/products/secondhand/secondhand_33_images__5__jpg.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493827/loop-tani/products/secondhand/secondhand_06_Blog_Alat_Semprot_Pertanian_jp.jpg',
          order: 2,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493830/loop-tani/products/secondhand/secondhand_08_OIP_jpg.jpg',
          order: 3,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493868/loop-tani/products/secondhand/secondhand_38_no_brand_no_brand_full01_webp.jpg',
          order: 4,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Pressure Sprayer Manual 5 Liter Tabung Pompa Tangan Second (ISKU & Mimi Moo Series)',
      description:
        'Tangki sprayer manual tekanan udara 5 liter pompa tangan praktis bekas pemakaian kebun rumahan. Bodi tebal anti pecah dengan katup pelepas tekanan otomatis (safety valve). Sangat ideal untuk penyemprotan pupuk daun tanaman hias, pembasmi kutu daun, disinfektan kandang, dan tanaman hidroponik.',
      price: 75000,
      stock: 6,
      unit: 'unit',
      weight: 1500,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Aceh',
      city: 'Banda Aceh',
      sellerRating: 4.7,
      totalReview: 28,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493842/loop-tani/products/secondhand/secondhand_18_e_jpeg.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493840/loop-tani/products/secondhand/secondhand_16_c_jpeg.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493847/loop-tani/products/secondhand/secondhand_22_ff_jpeg.jpg',
          order: 2,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_2_ID,
      title: 'Alat Kocor Pupuk Cair Tanaman Gendong Secondhand (Praktis untuk Cabai & Sayuran)',
      description:
        'Alat kocor pupuk tanaman gendong tipe gembor selang pegas bekas. Mempermudah aplikasi pemupukan kocor NPK cair pada tanaman hortikultura seperti cabai, tomat, terong, dan melon tanpa perlu membungkuk berulang kali. Dosis kocor keluar terukur dan hemat tenaga kerja.',
      price: 85000,
      stock: 4,
      unit: 'unit',
      weight: 3500,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Jambi',
      city: 'Kerinci',
      sellerRating: 4.6,
      totalReview: 19,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493849/loop-tani/products/secondhand/secondhand_24_h_jpeg.jpg',
          order: 0,
        },
      ],
    },
    {
      category: ProductCategory.SECONDHAND,
      sellerId: SELLER_ID,
      title: 'Set Alat Tebas & Arit Rumput Tradisional Baja Isen Secondhand (Gaet Tanjungsari & Golok Kebun)',
      description:
        'Koleksi alat pertanian tradisional pandai besi lokal berupa sabit gaet rumput Tanjungsari baja isen asli dan golok tebas kebun gagang kayu kokoh. Bilah baja sepuh tajam dan awet diasah, sangat cocok untuk membersihkan semak belukar, babat rumput pakan sapi, serta panen padi manual.',
      price: 95000,
      stock: 3,
      unit: 'set',
      weight: 1200,
      condition: ProductCondition.USED,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      province: 'Sumatera Barat',
      city: 'Agam',
      sellerRating: 4.8,
      totalReview: 24,
      images: [
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493871/loop-tani/products/secondhand/secondhand_41_sg_11134201_8261d_mkql2d5wofeo.jpg',
          order: 0,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493831/loop-tani/products/secondhand/secondhand_09_Sbaa5800c502648c1acaeb18f91fc3.jpg',
          order: 1,
        },
        {
          imageUrl:
            'https://res.cloudinary.com/aexisrpt/image/upload/v1789493860/loop-tani/products/secondhand/secondhand_32_id_11134207_8224o_mjyag98d8mbo.jpg',
          order: 2,
        },
      ],
    },
  ];

  let productCount = 0;
  for (const product of PRODUCTS_DATA) {
    const slug = slugify(product.title);
    const existing = await prisma.product.findFirst({ where: { slug } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          province: product.province,
          city: product.city,
          sellerRating: product.sellerRating,
          totalReview: product.totalReview,
          isFeatured: product.isFeatured,
          price: product.price,
          stock: product.stock,
          unit: product.unit,
          weight: product.weight,
          condition: product.condition,
          status: product.status,
          description: product.description,
        },
      });
      console.log(`  🔄 Updated: ${product.title} -> ${product.city}, ${product.province}`);
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
        unit: product.unit,
        weight: product.weight,
        condition: product.condition,
        status: product.status,
        isFeatured: product.isFeatured,
        province: product.province,
        city: product.city,
        sellerRating: product.sellerRating,
        totalReview: product.totalReview,
        images: {
          createMany: {
            data: product.images,
          },
        },
      },
    });

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
    console.log(`  ✅ [${product.category}] ${product.title} (${product.images.length} foto)`);
  }

  // Ensure legacy products in DB also have Sumatra locations
  const legacyUpdates = [
    { slugPattern: 'tomat-cherry', city: 'Karo', province: 'Sumatera Utara' },
    { slugPattern: 'beras-merah', city: 'Solok', province: 'Sumatera Barat' },
    { slugPattern: 'beras-putih', city: 'Deli Serdang', province: 'Sumatera Utara' },
    { slugPattern: 'quick-g1000', city: 'Medan', province: 'Sumatera Utara' },
    { slugPattern: 'traktor-mini', city: 'Pekanbaru', province: 'Riau' },
  ];

  for (const legacy of legacyUpdates) {
    await prisma.product.updateMany({
      where: { slug: { contains: legacy.slugPattern } },
      data: { city: legacy.city, province: legacy.province },
    });
  }

  // Fallback safety net for any remaining non-Sumatra product
  const sumatraProvincesList = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bengkulu',
    'Lampung',
    'Kepulauan Riau',
    'Kepulauan Bangka Belitung',
  ];
  await prisma.product.updateMany({
    where: { province: { notIn: sumatraProvincesList } },
    data: { province: 'Sumatera Utara', city: 'Medan' },
  });

  // ── 3. Seed Knowledge Content ──────────────────────────────────────────────
  console.log('\n📚 Seeding knowledge contents...');
  
  const KNOWLEDGE_DATA = [
    // ── ARTICLES ─────────────────────────────────────────────────────────────
    {
      type: 'ARTICLE' as const,
      title: 'Cara Membuat Pupuk Organik Cair dari Limbah Dapur',
      slug: 'poc-dari-limbah-dapur',
      content: 'Sisa sayuran, kulit buah, dan potongan dapur lainnya sering kali langsung dibuang ke tempat sampah, padahal bahan organik basah ini bisa difermentasi menjadi Pupuk Organik Cair (POC) berkualitas tinggi yang kaya akan nutrisi dan mikroorganisme bermanfaat bagi tanaman pekarangan maupun sayuran polybag.\n\nBahan-bahan yang dibutuhkan sangat praktis:\n• 1 kg sisa sayur atau kulit buah matang, dicacah kecil agar mudah diurai.\n• 100 ml air gula merah, tetes tebu (molase), atau gula pasir cair.\n• 1 liter air cucian beras pertama (leri) yang kaya vitamin B1.\n• Wadah tertutup seperti ember bertutup kencang atau jerigen bekas.\n\nLangkah pembuatan:\n1. Masukkan seluruh cacahan limbah sayur dan buah ke dalam wadah, lalu tuangkan air cucian beras dan larutan gula merah, aduk hingga rata.\n2. Tutup rapat wadah, namun sisakan celah kecil atau pasang selang pembuangan gas fermentasi anaerob agar wadah tidak kembung.\n3. Simpan di tempat teduh bersuhu ruang selama 2 hingga 3 minggu. Aduk perlahan setiap 2 hari sekali untuk mengeluarkan gas.\n4. Setelah tercium aroma asam manis segar menyerupai tapai (bukan aroma bangkai/busuk) dan cairan berubah menjadi kecokelatan, saring cairan POC.\n\nCara aplikasi di lapangan:\nEncerkan cairan POC dengan air bersih perbandingan 1:10 (100 ml POC dicampur dengan 1 liter air bersih). Siramkan ke media tanam atau semprotkan secara halus ke permukaan daun tanaman setiap 1–2 minggu sekali pada pagi hari. POC ini berfungsi sebagai pupuk pelengkap nutrisi tanaman yang ramah lingkungan dan menyuburkan mikrobioma tanah.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/poc-dari-limbah-dapur.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengolah Sekam Padi Menjadi Arang Sekam (Biochar)',
      slug: 'arang-sekam-biochar',
      content: 'Arang sekam atau biochar sekam padi adalah hasil pembakaran tidak sempurna (pirolisis terkendali) dari limbah penggilingan gabah padi. Berbeda dengan abu sekam biasa yang mudah hancur dan berdebu putih, arang sekam tetap mempertahankan struktur fisik berpori halus yang sangat efektif untuk memperbaiki aerasi tanah, menetralkan keasaman media tanam, serta menahan kelembapan dan ion unsur hara agar tidak mudah larut terbawa air siraman.\n\nAlat dan bahan yang disiapkan:\n• Sekam padi mentah yang kering dan bersih dari kotoran tanah.\n• Drum seng atau cerobong pembakaran silinder berlubang (bisa dirakit dari ram kawat kassa seng bekas setinggi 1 meter).\n• Kayu bakar kecil, sabut kelapa kering, atau arang sebagai pemantik api di dasar cerobong.\n\nLangkah pembuatan arang sekam:\n1. Letakkan cerobong silinder tegak di atas tanah lapang yang aman dari tiupan angin kencang. Nyalakan api kecil di dasar bagian dalam cerobong.\n2. Tumpuk sekam padi mengelilingi cerobong secara bertahap seperti bentuk gunung kerucut. Panas dari cerobong akan membakar sekam dari dalam ke luar secara perlahan tanpa menghasilkan kobaran api besar terbuka.\n3. Pantau perubahan warna sekam. Ratakan bagian yang sudah menghitam ke luar dan dorong sekam yang masih kuning kecokelatan mendekat ke dinding cerobong.\n4. Setelah seluruh sekam berubah warna menjadi hitam legam merata (sekitar 90-95% terkarbonisasi), segera siram dengan air bersih secara merata untuk menghentikan proses pembakaran agar tidak terlanjur menjadi abu putih.\n5. Tiriskan dan jemur arang sekam hingga benar-benar kering sebelum dikemas rapi dalam karung.\n\nManfaat bagi lahan pertanian:\nArang sekam membuat tanah liat menjadi lebih gembur, menstabilkan pH tanah masam, meningkatkan kapasitas tukar kation (KTK), dan menjadi rumah perlindungan ideal bagi mikroba tanah yang menguntungkan. Campurkan arang sekam, pupuk kandang, dan tanah dengan perbandingan 1:1:1 sebagai media tanam bibit unggul.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/arang-sekam-biochar.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Manfaat Mulsa Jerami untuk Tanaman',
      slug: 'manfaat-mulsa-jerami',
      content: 'Daripada dibakar di sawah yang dapat memicu polusi kabut asap dan mematikan cacing tanah, jerami sisa panen padi dapat langsung dimanfaatkan sebagai mulsa organik alami di permukaan bedengan tanaman hortikultura. Pendekatan sirkular ini sangat murah, mudah diterapkan petani mandiri, dan memberikan manfaat agronomis yang signifikan bagi kesehatan tanah.\n\nManfaat utama penggunaan mulsa jerami:\n1. Menekan pertumbuhan gulma liar: Lapisan jerami menghalangi penetrasi sinar matahari langsung ke permukaan tanah sehingga biji rumput liar sulit berkecambah.\n2. Menjaga kelembapan tanah: Mengurangi laju evaporasi penguapan air di musim kemarau, sehingga frekuensi penyiraman tanaman dapat dikurangi hingga 40%.\n3. Menstabilkan suhu perakaran: Melindungi perakaran tanaman dari sengatan terik panas matahari di siang hari dan menjaga kehangatan media di malam hari.\n4. Menambah cadangan bahan organik: Seiring berjalannya waktu, jerami akan terlapuk secara bertahap oleh mikroba tanah dan melepaskan unsur hara kalium serta silika alami ke dalam tanah.\n\nCara aplikasi yang tepat:\nGelar hamparan jerami padi kering setebal 5 hingga 10 cm di atas permukaan bedengan di sekeliling tajuk tanaman. Berikan jarak sekitar 3-5 cm dari pangkal batang utama tanaman cabai atau tomat agar kelembapan berlebih tidak memicu infeksi jamur busuk batang. Tambahkan lapisan mulsa jerami baru secara berkala jika lapisan lama mulai menyusut dan terurai.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/manfaat-mulsa-jerami.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 3,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengubah Kulit Kopi Menjadi Pupuk Kompos',
      slug: 'kompos-kulit-kopi',
      content: 'Setiap musim panen raya kopi tiba di dataran tinggi Gayo, Tanah Karo, maupun Lampung, limbah kulit buah kopi (cascara/pulp) yang terkelupas dari biji sering kali menumpuk menggunung di sekitar stasiun pengolahan basah. Timbunan basah ini dapat mencemari air sungai jika tidak diolah. Padahal, kulit buah kopi menyimpan cadangan hara Kalium (K) dan Nitrogen (N) alami yang sangat tinggi untuk menyuburkan kembali kebun kopi dan tanaman perkebunan lainnya.\n\nTahapan pengomposan kulit kopi:\n1. Kumpulkan kulit kopi segar yang baru dikupas, lalu tiriskan airnya. Campurkan dengan bahan cokelat kering seperti serasah daun kering, sekam padi, atau serbuk gergaji agar kadar air tumpukan tidak terlalu basah becek (ideal sekitar 55-60%).\n2. Campurkan kotoran ternak kambing atau sapi serta sedikit larutan bioaktivator (seperti EM4 atau Trichoderma) untuk mempercepat perombakan serat selulosa kulit kopi.\n3. Susun berlapis dalam tumpukan windrow setinggi 1 meter di area ternaungi terpal atau atap seng.\n4. Balik tumpukan kompos secara berkala setiap 1 hingga 2 minggu sekali guna memasukkan suplai oksigen bagi bakteri aerob dekomposer.\n5. Kompos matang sempurna dalam kurun waktu 6 hingga 8 minggu, ditandai warna hitam kecokelatan gelap, tekstur remah gembur, dan tidak berbau asam menyengat.\n\nCatatan penting agronomi:\nKulit kopi segar memiliki pH awal yang cukup asam (sekitar 4,2–4,8). Oleh karena itu, disarankan menambahkan kapur dolomit atau abu sekam sebanyak 2-3% dari bobot bahan guna menetralkan pH tanah. Kompos kulit kopi ini sangat manjur diaplikasikan di sekeliling piringan pohon kopi menjelang pembentukan bunga dan pembesaran buah.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/kompos-kulit-kopi.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengenal Pupuk Kandang: Jenis dan Cara Aplikasinya',
      slug: 'mengenal-pupuk-kandang',
      content: 'Pupuk kandang yang berasal dari kotoran padat dan urin hewan ternak merupakan pilar utama pertanian organik dan pembenah kesuburan tanah yang paling mudah didapatkan petani pedesaan. Namun, tidak semua pupuk kandang memiliki sifat dan karakter nutrisi yang sama; tiap jenis ternak memiliki keunggulan hara tersendiri.\n\nKarakteristik jenis pupuk kandang ternak:\n• Kotoran sapi dan kerbau: Memiliki kadar nitrogen sedang dengan rasio serat selulosa yang tinggi serta bersifat dingin. Sangat baik untuk memperbaiki struktur fisik tanah lempung dan tanah berpasir agar lebih gembur dan mampu menahan air.\n• Kotoran ayam dan unggas: Mengandung konsentrasi nitrogen dan fosfor tertinggi di antara pupuk kandang lainnya. Bersifat panas dan cepat terurai, sehingga mutlak harus difermentasi matang sebelum digunakan agar tidak membakar bibit.\n• Kotoran kambing dan domba: Berbentuk butiran bulat kering (intil) dengan kandungan kalium dan nitrogen yang seimbang. Lebih lambat melepaskan hara (slow release) sehingga sangat ideal sebagai pupuk dasar jangka panjang pada tanaman perkebunan dan hortikultura.\n\nPrinsip aplikasi yang aman dan efektif:\nPupuk kandang segar pantang diaplikasikan langsung ke tanaman karena masih mengalami proses fermentasi panas, menghasilkan gas amonia pekat, serta berpotensi membawa biji gulma dan spora jamur patogen. Lakukan fermentasi terlebih dahulu selama 3-4 minggu hingga suhu tumpukan stabil dingin, warna menjadi cokelat gelap kehitaman, dan aroma kotoran berubah menjadi bau tanah segar.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/mengenal-pupuk-kandang.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Tips Memilih Alat Pertanian Bekas yang Masih Layak Pakai',
      slug: 'tips-memilih-alat-pertanian-bekas',
      content: 'Membeli alat dan mesin pertanian (alsintan) bekas di platform sirkular seperti LoopTani merupakan strategi cerdas untuk menghemat modal awal usaha tani, khususnya bagi petani pemula atau kelompok tani yang sedang memperluas skala garapan. Kendati demikian, kejelian dalam memeriksa kondisi fisik dan mekanis alat sangat diperlukan agar terhindar dari biaya perbaikan yang membengkak.\n\nBagian penting yang wajib diperiksa:\n1. Integritas pelat logam: Pastikan tidak ada karat keropos yang menggerogoti struktur rangka utama. Karat permukaan tipis masih wajar dan mudah dibersihkan, tetapi rangka yang retak atau bengkok menandakan alat pernah menerima beban kejut berlebih.\n2. Sambungan dan mata kerja: Pada alat manual seperti cangkul, sabit, dodos, atau egrek sawit, pastikan mata bilah masih tebal dan sambungan pipa gagang masih menyatu kokoh tanpa goyang.\n3. Mesin bermotor (traktor tangan, pompa alkon, mesin chopper): Periksa kelancaran tarikan recoil starter, dengarkan suara kompresi mesin saat hidup (pastikan tidak ada ketukan logam kasar), periksa kebocoran oli di sekitar karter seal, dan cek kondisi busi atau injektor solar.\n4. Ketersediaan suku cadang: Pastikan tipe dan merk alat tersebut memiliki suku cadang pengganti yang mudah dicari di toko mesin pertanian terdekat.\n\nTips transaksi dan tawar-menawar:\nBandingkan harga penawaran alat bekas terhadap harga unit baru sebagai patokan. Pertimbangkan estimasi biaya rekondisi ringan seperti ganti oli, amplas karat, atau ganti tali v-belt. Pilihlah penjual terverifikasi yang bersedia mendemonstrasikan fungsi alat secara transparan.',
      category: 'ALAT' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/tips-memilih-alat-pertanian-bekas.jpg',
      rewardPoint: 25,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Cara Merawat Cangkul dan Alat Tani Manual Agar Awet',
      slug: 'merawat-cangkul-alat-tani-manual',
      content: 'Alat pertanian manual seperti cangkul, sabit babat, garu tanah, parang, dan koret gulma sering kali dianggap sebagai perkakas kasar yang tidak memerlukan perhatian khusus. Faktanya, kebiasaan sederhana sehabis pemakaian sehari-hari di ladang sangat menentukan apakah alat tersebut bisa bertahan belasan tahun atau justru patah dan berkarat dalam hitungan bulan.\n\nLangkah perawatan rutin harian:\n1. Bersihkan tanah basah dan getah tanaman: Segera bersihkan lempung sawah dan getah rumput yang menempel pada daun cangkul atau mata sabit sebelum mengering dan mengeras menjadi kerak.\n2. Cuci dan keringkan: Bilas dengan air lalu seka dengan kain kering sebelum alat disimpan. Menyimpan alat dalam kondisi lembap di lantai semen adalah penyebab utama timbulnya karat oksidasi.\n3. Lapisan pelindung minyak: Oleskan tipis sedikit oli bekas bersih, solar, atau minyak goreng pada seluruh permukaan bilah besi secara berkala, terutama menjelang masa jeda musim tanam ketika alat tidak digunakan berminggu-minggu.\n4. Periksa gagang kayu: Pastikan pasak pengunci antara mata cangkul dan doran kayu tetap kencang. Jika doran kayu mulai retak atau lapuk, segera ganti dengan kayu ulin atau sonokeling yang liat agar tidak patah saat menghantam batu.\n\nManajemen tempat penyimpanan:\nSimpan alat tani manual di tempat yang kering, berventilasi baik, dan terlindung dari tampias air hujan. Sangat dianjurkan untuk menggantung alat pada dinding papan atau rak khusus agar mata bilahnya tidak tumpul bersentuhan langsung dengan lantai tanah yang basah.',
      category: 'ALAT' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/merawat-cangkul-alat-tani-manual.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 3,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Panduan Merawat Traktor Tangan Bekas untuk Petani',
      slug: 'merawat-traktor-tangan-bekas',
      content: 'Traktor tangan (hand tractor) bekas pakai yang ditenagai mesin diesel silinder tunggal adalah tulang punggung pengolahan tanah bagi petani padi dan palawija. Dengan pemeliharaan preventif yang konsisten, traktor tangan bekas yang sudah berusia puluhan tahun pun tetap sanggup bekerja bertenaga, hemat solar, dan tidak mudah mogok di tengah petakan sawah yang berlumpur dalam.\n\nPoin-poin servis berkala yang wajib dikerjakan:\n1. Pergantian oli mesin diesel secara disiplin: Ganti oli mesin (SAE 40 atau 15W-40) setiap 100 jam kerja operasional atau pada setiap awal musim olah tanah. Oli mesin diesel berfungsi menyerap jelaga sisa pembakaran solar; menunda ganti oli akan mengikis dinding silinder liner dan ring piston.\n2. Pembersihan saringan udara (Air Cleaner): Setelah seharian membajak sawah yang berdebu atau beruap lumpur, cuci mangkuk saringan udara tipe oli basah dan ganti oli di dalam mangkuknya dengan oli bersih agar debu tidak masuk ke ruang bakar.\n3. Inspeksi dan pengasahan bilah pisau rotari: Periksa ketajaman mata pisau bajak rotari. Asah atau ganti pisau yang sudah rompal agar traktor tidak terasa berat dan hasil cacahan tanah tetap gembur merata.\n4. Cek ketegangan tali v-belt penggerak: Pastikan tali kipas v-belt tidak selip saat beban berat. Berikan toleransi kelenturan sekitar 10-15 mm saat ditekan ibu jari di antara kedua puli.\n\nTips penyimpanan seusai musim olah tanah:\nSetelah masa bajak selesai, cuci bersih seluruh lumpur yang menempel pada roda besi dan rangka bodi traktor. Semprotkan cairan anti karat pada bagian logam yang catnya terkelupas. Kosongkan tangki solar atau bersihkan saringan mangkuk bahan bakar agar tidak timbul lumut dan endapan air di dalam injektor selama traktor beristirahat di garasi.',
      category: 'ALAT' as const,
      difficulty: 'MENENGAH' as const,
      imageUrl: '/images/panduan/merawat-traktor-tangan-bekas.jpg',
      rewardPoint: 30,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengenal Hama Wereng dan Cara Pengendaliannya Secara Alami',
      slug: 'hama-wereng-pengendalian-alami',
      content: 'Wereng Batang Cokelat (Nilaparvata lugens) merupakan salah satu hama paling ditakuti pada budidaya tanaman padi di seluruh Indonesia. Serangga pengisap cairan batang tanaman padi ini mampu melipatgandakan populasinya dalam waktu sangat singkat dan menularkan virus kerdil hampa yang berujung pada puso (gagal panen total).\n\nGejala dan tanda serangan di sawah:\n• Tanaman padi menguning merata mulai dari pelepah daun bagian bawah rumpun.\n• Timbul bercak melingkar tanaman mengering cokelat jerami (gejala hopperburn) di tengah hamparan sawah seperti bekas terbakar api.\n• Jika rumpun padi digoyang perlahan, ratusan nimfa dan wereng dewasa berwarna cokelat keabuan akan terlihat beterbangan dan merayap lincah di pangkal batang tanaman tepat di atas permukaan air.\n\nStrategi pengendalian alami dan ramah lingkungan:\n1. Konservasi musuh alami predator: Kurangi penyemprotan insektisida kimia berspektrum luas yang membabi buta, karena racun tersebut justru membunuh predator alami wereng seperti laba-laba serigala (Pardosa pseudoannulata), kumbang Paederus, dan kepik Cyrtorhinus lividipennis.\n2. Penjarangan jarak tanam: Terapkan sistem jajar legowo (misalnya pola 2:1) agar kelembapan di dalam rumpun padi tidak terlalu tinggi dan sirkulasi angin serta cahaya matahari bebas masuk menyinari pangkal batang.\n3. Rotasi varietas benih tahan wereng: Ganti varietas padi secara bergilir tiap musim tanam (misalnya Inpari 32, Inpari 42, atau varietas unggul lokal teruji) untuk memutus adaptasi genetik wereng.\n4. Aplikasi pestisida nabati dan agens hayati: Semprotkan ekstrak daun mimba dan serai wangi, atau aplikasikan jamur entomopatogen Beauveria bassiana pada sore hari saat kelembapan sawah mendukung infeksi spora jamur terhadap wereng.',
      category: 'OLAHAN' as const,
      difficulty: 'MENENGAH' as const,
      imageUrl: '/images/panduan/hama-wereng-pengendalian-alami.jpg',
      rewardPoint: 25,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Pengendalian Hama Tikus Sawah Secara Ramah Lingkungan',
      slug: 'pengendalian-tikus-sawah',
      content: 'Tikus sawah (Rattus argentiventer) merupakan hama mamalia pengerat yang cerdas, memiliki daya adaptasi tinggi, dan hidup berpindah-pindah melintasi batas kepemilikan petak sawah. Menghadapi serangan tikus secara sendirian pada satu petak sering kali sia-sia karena tikus akan dengan mudah lari ke lahan tetangga dan kembali menyerang saat malam tiba.\n\nMetode pengendalian mekanis dan komunal yang terbukti efektif:\n1. Gropyokan massal terpadu: Perburuan sarang tikus secara serentak bersama seluruh anggota kelompok tani sebelum musim tanam dimulai (fase bera/olah tanah). Gunakan pengemposan asap belerang ke lubang aktif untuk menekan populasi awal indukan tikus.\n2. Sistem Trap Barrier System (TBS) dan Linier Trap Barrier System (LTBS): Pasang bentangan pagar plastik setinggi 60 cm mengelilingi petak tanaman perangkap yang ditanam 2-3 minggu lebih awal dari hamparan sawah sekitar. Lengkapi dengan bubu perangkap kawat ram bermulut corong satu arah di sepanjang dinding plastik untuk menangkap puluhan ekor tikus tiap malam tanpa racun.\n3. Sanitasi pematang dan lingkungan: Ratakan dan persempit ukuran pematang sawah (lebar pematang di bawah 30 cm) serta bersihkan gulma semak di tanggul irigasi agar tikus tidak nyaman bersarang dan berkembang biak.\n4. Pemanfaatan burung hantu Tyto alba: Bangun Rumah Burung Hantu (Rubuha) di tengah hamparan sawah (1 unit Rubuha per 5 hektar lahan). Sepasang burung hantu aktif mampu memangsa 2 hingga 5 ekor tikus setiap malam secara alami tanpa meninggalkan residu bahan kimia beracun.',
      category: 'ALAT' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/pengendalian-tikus-sawah.jpg',
      rewardPoint: 25,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Cara Mendeteksi Penyakit Layu pada Tanaman Cabai',
      slug: 'deteksi-penyakit-layu-cabai',
      content: 'Penyakit layu mendadak merupakan ancaman fatal yang paling ditakuti petani cabai merah dan cabai rawit. Tanaman yang semula segar dan sedang sarat bunga bisa terkulai layu dalam hitungan hari. Tantangan terbesarnya adalah: gejala layu dapat disebabkan oleh dua penyebab yang sama sekali berbeda sifatnya—yakni Layu Jamur Fusarium dan Layu Bakteri Ralstonia—yang memerlukan tindakan penanganan yang berbeda pula.\n\nMembedakan Layu Fusarium vs Layu Bakteri:\n• Layu Fusarium (Cendawan Fusarium oxysporum): Gejala layu terjadi bertahap, biasanya diawali dari daun bagian bawah yang menguning lalu merambat ke atas. Pada siang hari tanaman tampak layu, namun sempat tampak segar kembali di malam atau pagi hari sebelum akhirnya mati permanen. Jika pangkal batang dibelah membujur, terdapat garis kecokelatan pada berkas pembuluh xilem.\n• Layu Bakteri (Ralstonia solanacearum): Layu terjadi sangat cepat dan mendadak. Seluruh daun tanaman terkulai layu serentak saat warna daun masih hijau segar. Tanaman tidak sempat menguning dan tidak pulih di pagi hari. Uji diagnosa cepat: potong pangkal batang tanaman yang layu sepanjang 3 cm, lalu gantungkan potongan batang tersebut ke dalam gelas kaca berisi air jernih. Jika keluar untaian lendir kabut putih susu (bacterial ooze) yang mengalir turun ke dasar gelas, dipastikan tanaman terserang layu bakteri.\n\nLangkah pencegahan dan sanitasi kebun:\n1. Terapkan rotasi tanaman dengan komoditas bukan famili Solanaceae (seperti jagung atau kacang-kacangan).\n2. Tingkatkan pH tanah asam dengan aplikasi kapur dolomit dan tambahkan jamur antagonis Trichoderma harzianum ke dalam pupuk dasar.\n3. Perbaiki drainase bedengan dengan parit dalam agar air hujan tidak menggenang di sekitar perakaran.\n4. Segera cabut tanaman yang terinfeksi parah beserta tanah perakarannya, masukkan ke dalam kantong plastik tertutup, dan musnahkan di luar kebun agar tidak menular ke tanaman sehat.',
      category: 'LIMBAH' as const,
      difficulty: 'MENENGAH' as const,
      imageUrl: '/images/panduan/deteksi-penyakit-layu-cabai.jpg',
      rewardPoint: 25,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengenal Pupuk NPK dan Dosis yang Tepat untuk Padi',
      slug: 'pupuk-npk-dosis-padi',
      content: 'NPK adalah pupuk majemuk yang memadukan tiga unsur hara makro primer yang paling krusial bagi pertumbuhan tanaman: Nitrogen (N), Fosfor (P), dan Kalium (K). Pada budidaya tanaman padi sawah, ketepatan formulasi, dosis, serta waktu pemberian pupuk NPK menjadi faktor penentu utama antara panen melimpah berbobot atau tanaman rebah tak berisi.\n\nPeran fisiologis masing-masing unsur bagi padi:\n• Nitrogen (N): Mendorong pertumbuhan vegetatif awal, merangsang pembentukan anakan produktif, dan membentuk zat hijau daun (klorofil) untuk fotosintesis.\n• Fosfor (P): Mempercepat perkembangan perakaran tanaman muda dan merangsang pembentukan malai serta pembungaan serentak.\n• Kalium (K): Memperkuat dinding sel batang padi agar tidak mudah rebah tertiup angin kencang, meningkatkan translokasi pati untuk pengisian bulir gabah bernas, serta mempertebal daya tahan tanaman terhadap serangan jamur blas dan hama wereng.\n\nWaktu dan tata cara aplikasi dosis berimbang:\nPemupukan padi sawah umumnya dibagi menjadi 3 tahapan aplikasi:\n1. Pupuk dasar (0–7 HST): Taburkan kombinasi NPK dan pupuk organik dasar saat perataan tanah sawah terakhir untuk memacu adaptasi akar bibit pindah tanam.\n2. Pupuk susulan pertama (18–21 HST): Berikan pemupukan penunjang anakan dengan perimbangan N dan P yang cukup agar anakan padi tumbuh produktif.\n3. Pupuk susulan kedua (35–45 HST): Diberikan saat tanaman memasuki fase bunting sebelum berbunga (primordia). Pada fase ini, unsur Kalium harus mendominasi untuk menjamin bulir malai terisi penuh dari pangkal hingga ujung tangkai.\n\nHindari pemupukan berlebih:\nPemberian pupuk urea (nitrogen) yang berlebihan justru membuat batang padi menjadi sukulen (lunak berair), rentan rebah, dan menjadi sasaran empuk serangan hama wereng serta kresek bakteri hawar daun. Selalu ikuti rekomendasi uji tanah setempat.',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/pupuk-npk-dosis-padi.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Cara Membuat Pestisida Nabati dari Daun Mimba',
      slug: 'pestisida-nabati-daun-mimba',
      content: 'Pohon mimba (Azadirachta indica) sering tumbuh liar di pinggir jalan dan pematang kebun pedesaan. Di balik kepahitan daunnya, mimba menyimpan senyawa aktif kelompok limonoid bernama Azadirachtin yang merupakan salah satu pestisida hayati terkuat di alam untuk mengendalikan ratusan jenis hama serangga tanpa merusak kelestarian lingkungan dan tanpa meninggalkan residu kimia berbahaya pada sayuran panen.\n\nBahan-bahan yang dipersiapkan:\n• 1 kg daun mimba segar (beserta ranting mudanya).\n• 5 liter air bersih tawar bebas kaporit.\n• 1 sendok makan sabun cuci piring cair atau lerak sebagai bahan perata (surfactant).\n\nLangkah peracikan ekstraksi dingin:\n1. Tumbuk halus atau blender daun mimba dengan menambahkan sedikit air hingga membentuk bubur hijau kental pekat.\n2. Masukkan bubur mimba ke dalam ember berisi 5 liter air, lalu aduk merata. Hindari merebus daun mimba karena suhu mendidih akan merusak molekul senyawa aktif azadirachtin.\n3. Tutup ember dan diamkan rendaman selama minimal 12 hingga 24 jam di tempat teduh terhindar dari sinar matahari langsung.\n4. Saring larutan menggunakan saringan kain kassa halus agar ampas serat daun tidak menyumbat lubang spuyer nozzle tangki semprot.\n5. Campurkan sedikit sabun cair agar larutan pesnab mampu menempel erat dan merata di permukaan lilin daun tanaman.\n\nPetunjuk aplikasi di kebun:\nSemprotkan larutan ekstrak mimba pada sore hari menjelang matahari terbenam. Sinar ultraviolet matahari terik di siang hari dapat menguraikan azadirachtin lebih cepat. Aplikasikan secara berkala tiap 3-5 hari sekali saat intensitas serangan hama ulat, kutu kebul, atau thrips mulai terlihat di lahan.',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/pestisida-nabati-daun-mimba.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 3,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Panduan Budidaya Cabai Rawit untuk Pemula',
      slug: 'budidaya-cabai-rawit-pemula',
      content: 'Cabai rawit merupakan salah satu komoditas hortikultura bernilai ekonomi tinggi yang memiliki pasar konsumsi sangat stabil di Indonesia. Menanam cabai rawit relatif mudah dipelajari oleh pemula karena daya tahannya yang tangguh terhadap fluktuasi iklim tropis, baik dibudidayakan di bedengan lahan terbuka maupun di pekarangan rumah menggunakan wadah polybag.\n\nPersiapan benih dan persemaian:\nPilihlah benih cabai unggul bersertifikat atau benih dari indukan buah matang yang sehat. Semai benih pada tray semai atau polybag mini berisi campuran tanah halus dan pupuk kompos matang (1:1). Letakkan di tempat ternaungi jaring paranet. Pada usia 21–28 hari setelah semai, ketika bibit telah memiliki 4–5 helai daun sejati yang kokoh, bibit siap dipindahkan ke media tanam utama.\n\nPengolahan media tanam:\nCabai rawit sangat tidak tahan terhadap genangan air becek. Olah tanah hingga gembur dan buat bedengan setinggi 30–40 cm dengan saluran parit drainase yang lancar. Campurkan pupuk kandang matang dan sedikit kapur dolomit untuk menetralkan pH tanah pada kisaran 6,0–6,8.\n\nTahapan perawatan intensif:\n1. Penyiraman rutin: Siram media tanam secukupnya tiap pagi atau sore, terutama saat fase pembungaan dan pembentukan pentil buah agar bunga tidak rontok.\n2. Pemasangan ajir bambu: Pasang ajir bambu setinggi 1 meter di samping bibit untuk menopang cabang tanaman agar tidak roboh saat mulai berbuah lebat tertiup angin.\n3. Pemupukan susulan: Berikan pupuk organik cair atau pupuk NPK berimbang tiap 2 minggu sekali dengan cara dikocor ke pangkal perakaran.\n4. Pengendalian hama: Amati daun secara berkala dari serangan kutu daun, thrips pemicu daun keriting, serta lalat buah.\n\nMasa panen raya:\nCabai rawit umumnya mulai dapat dipanen pada usia 75 hingga 90 hari setelah tanam. Pemetikan buah dilakukan secara bertahap setiap 4-7 hari sekali di pagi hari dengan memetik tangkai buahnya utuh. Tanaman cabai rawit yang dirawat dengan baik dapat terus berproduksi hingga umur 1,5–2 tahun!',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/budidaya-cabai-rawit-pemula.jpg',
      rewardPoint: 25,
      estimatedReadingMinutes: 5,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Cara Budidaya Tomat Organik di Lahan Sempit',
      slug: 'budidaya-tomat-organik-lahan-sempit',
      content: 'Keterbatasan lahan pekarangan di area perkotaan atau pedesaan bukan penghalang untuk menghasilkan panen sayuran segar yang melimpah. Dengan memanfaatkan polybag berukuran 40x40 cm, ember bekas, atau pot tanaman, budidaya tomat organik dapat tumbuh subur, berbuah lebat, dan bernutrisi tinggi tanpa sentuhan bahan kimia sintetis.\n\nKomposisi media tanam subur gembur:\nGunakan formula perbandingan seimbang antara tanah kebun gembur, kompos matang/kasgot, dan arang sekam padi (perbandingan 2:1:1). Arang sekam menjamin aerasi media tetap gembur dan tidak memadat, sementara kompos menyediakan cadangan hara organik lengkap bagi akar tanaman tomat.\n\nPerawatan tomat organik tanpa pupuk sintetis:\n1. Pasang ajir bambu penyangga sejak awal tanam saat bibit masih kecil agar perakaran tanaman tidak terganggu atau putus saat pemasangan bambu di kemudian hari.\n2. Pemangkasan tunas air (pruning): Buang tunas air liar yang tumbuh di ketiak daun secara rutin setiap minggu. Biarkan hanya 1 atau 2 cabang produktif utama agar aliran nutrisi tanaman terpusat penuh untuk pembesaran dan pematangan buah.\n3. Suplai nutrisi organik: Kocor media tanam dengan Pupuk Organik Cair (POC) limbah buah atau air rendaman kotoran kambing setiap 7–10 hari sekali.\n4. Perlindungan hayati: Semprotkan ekstrak pesnab daun mimba atau serai wangi secara berkala untuk menangkal lalat buah dan ulat penggerek buah.\n\nPanen tomat buah segar:\nBuah tomat organik siap dipetik mulai umur 70 hingga 85 hari setelah pindah tanam, ditandai warna kulit buah yang mulai memerah merata dan terasa kenyal berair. Petik bersama tangkainya agar buah lebih awet disimpan.',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/budidaya-tomat-organik-lahan-sempit.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengenal Sistem Tanam Jajar Legowo untuk Padi',
      slug: 'sistem-tanam-jajar-legowo',
      content: 'Sistem tanam Jajar Legowo adalah teknik rekayasa pola tanam padi sawah yang diperkenalkan oleh badan penelitian pertanian untuk mengoptimalkan penetrasi sinar matahari dan sirkulasi angin di setiap rumpun tanaman padi, berbeda dari pola tanam tegel bujur sangkar konvensional.\n\nCara kerja dan filosofi jajar legowo:\nIstilah "legowo" berasal dari bahasa Jawa "lego" (luas) dan "dowo" (panjang). Pada pola Legowo 2:1 misalnya, dua barisan rumpun padi ditanam dengan jarak rapat (20-25 cm antar rumpun), diikuti oleh satu barisan kosong selebar 40-50 cm, lalu dilanjutkan dua barisan rapat berikutnya. Pola ini menciptakan efek barisan pinggir (border effect) pada setiap tanaman padi, di mana seluruh tanaman di pinggir lorong kosong mendapatkan paparan sinar matahari penuh layaknya tanaman yang berada di pematang sawah.\n\nManfaat nyata bagi hasil panen petani:\n1. Meningkatkan anakan produktif: Paparan cahaya matahari yang optimal memacu fotosintesis maksimal, menghasilkan anakan produktif lebih banyak dan bulir gabah yang lebih padat bernas.\n2. Menekan kelembapan dan penyakit: Sirkulasi udara yang lancar di lorong legowo menurunkan kelembapan mikro di dalam rumpun, sehingga secara alami menekan perkembangbiakan jamur blas, hawar daun bakteri, dan hama wereng batang cokelat.\n3. Memudahkan pemeliharaan lahan: Lorong barisan kosong berfungsi sebagai jalan inspeksi yang memudahkan petani menyiangi gulma, menabur pupuk, maupun mengamati serangan hama tanpa merusak rumpun padi.\n4. Populasi tanaman meningkat: Meski terdapat lorong kosong, kerapatan tanaman di dalam baris rapat justru meningkatkan populasi rumpun padi per hektar hingga 20-30%, mendongkrak hasil gabah panen secara terukur.',
      category: 'ALAT' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/sistem-tanam-jajar-legowo.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 3,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Manfaat Rotasi Tanaman untuk Kesuburan Tanah',
      slug: 'manfaat-rotasi-tanaman',
      content: 'Praktik menanam satu jenis tanaman yang sama secara terus-menerus di lahan pertanian (monokultur berkepanjangan) terbukti menguras cadangan unsur hara tertentu di dalam profil tanah serta memicu ledakan populasi hama dan penyakit tanah yang menetap. Rotasi tanaman atau pergiliran tanaman secara berjadwal merupakan solusi ekologis fundamental dalam pengelolaan lahan berkelanjutan.\n\nPrinsip kerja rotasi tanaman berimbang:\nPergiliran tanaman disusun berdasarkan perbedaan pola perakaran dan variasi kebutuhan nutrisi tanaman. Sebagai contoh: tanaman padi atau jagung menyerap hara Nitrogen dalam jumlah besar. Jika setelah panen padi lahan langsung ditanami tanaman leguminosa (kacang tanah, kedelai, atau kacang hijau), bakteri Rhizobium pada bintil akar kacang-kacangan justru akan menangkap gas nitrogen bebas dari atmosfer dan mengikatnya kembali ke dalam tanah sebagai cadangan nutrisi bagi tanaman berikutnya.\n\nKeuntungan ekologis dan ekonomis rotasi tanaman:\n1. Memutus siklus hidup hama dan penyakit: Hama atau cendawan patogen yang spesifik menyerang satu komoditas akan kehilangan inang makanannya saat komoditas diganti, sehingga populasinya anjlok drastis tanpa perlu racun kimia berlebih.\n2. Menyeimbangkan nutrisi tanah: Tanaman berakar dangkal (seperti sayuran daun) diselingi dengan tanaman berakar dalam (seperti ketela pohon atau jagung) yang mampu menyerap nutrisi di lapisan tanah lebih bawah, merestorasi profil kesuburan lapisan olah.\n3. Diversifikasi pendapatan petani: Dengan merotasi tanaman padi, palawija, dan hortikultura sayuran dalam setahun tanam, petani mendapatkan arus pendapatan yang berkelanjutan di luar musim panen utama.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/manfaat-rotasi-tanaman.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengolah Singkong Menjadi Tepung Mocaf, Produk Olahan Bernilai Tambah',
      slug: 'mengolah-singkong-tepung-mocaf',
      content: 'Singkong atau ubi kayu merupakan tanaman pangan tropis yang melimpah di seluruh pelosok negeri, namun harga jual singkong mentah di tingkat petani sering kali jatuh sangat rendah saat panen raya tiba. Selain itu, umbi singkong mentah mudah rusak dan membusuk dalam beberapa hari setelah dicabut. Mengolah singkong menjadi MOCAF (Modified Cassava Flour / Tepung Singkong Termodifikasi) adalah inovasi produk olahan bernilai tambah tinggi yang melipatgandakan margin pendapatan petani dan UMKM pedesaan.\n\nKelebihan mocaf dibanding tepung singkong biasa:\nProses modifikasi mocaf bertumpu pada fermentasi asam laktat alami. Fermentasi mikroba melarutkan sebagian dinding sel pati singkong, melenyapkan aroma khas singkong mentah (tengik), menghasilkan warna tepung yang putih bersih, serta meningkatkan daya kembang dan elastisitas adonan. Mocaf bebas gluten (gluten-free) sehingga sangat dicari oleh industri bakery, kue basah, mie, dan camilan sehat modern pengganti tepung terigu impor.\n\nTahapan proses pembuatan mocaf mandiri:\n1. Pengupasan dan pencucian: Kupas kulit luar dan kulit ari singkong segar, lalu cuci bersih di air mengalir hingga lendir getahnya hilang.\n2. Penyerutan tipis (slicing): Pasah atau serut singkong menjadi lembaran chips tipis berukuran 1-2 mm menggunakan pisau serut agar proses fermentasi dan pengeringan berjalan cepat.\n3. Fermentasi perendaman: Rendam irisan singkong dalam bak air bersih selama 24 hingga 72 jam. Untuk hasil maksimal, tambahkan starter bakteri asam laktat (Lactobacillus plantarum). Fermentasi ditandai timbulnya aroma wangi asam segar khas fermentasi.\n4. Pembilasan dan penirisan: Tiriskan irisan singkong fermentasi dan bilas dengan air bersih untuk menghentikan keasaman berlebih.\n5. Penjemuran dan penepungan: Jemur chips singkong di atas para-para beralas jaring bersih di bawah terik matahari hingga kering renyah berkadar air di bawah 12%. Giling chips kering menggunakan mesin disc mill dan ayak dengan ayakan 80-100 mesh hingga menghasilkan tepung mocaf super halus.',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/mengolah-singkong-tepung-mocaf.jpg',
      rewardPoint: 25,
      estimatedReadingMinutes: 4,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengolah Limbah Kulit Pisang Menjadi Keripik Bernilai Jual',
      slug: 'olah-kulit-pisang-jadi-keripik',
      content: 'Industri olahan kuliner berbahan dasar pisang—seperti produsen keripik pisang, sale pisang, dan pisang goreng krispi—menghasilkan berton-ton limbah kulit pisang setiap harinya. Biasanya kulit pisang ini hanya dibuang begitu saja ke tempat pembuangan akhir hingga membusuk dan menimbulkan bau tidak sedap. Padahal, kulit pisang dari varietas tertentu (seperti pisang kepok dan pisang tanduk) memiliki dinding kulit yang tebal, kaya akan serat pangan, antioksidan polifenol, serta vitamin B6 yang dapat disulap menjadi camilan keripik renyah bernilai ekonomis tinggi.\n\nLangkah-langkah pengolahan keripik kulit pisang:\n1. Pemilihan bahan baku: Pilih kulit pisang segar dari pisang yang belum terlalu matang benyek (pisang mengkal dengan kulit hijau kekuningan). Cuci bersih kulit pisang untuk meluruhkan debu dan getah getahnya.\n2. Penghilangan rasa kelat dan getah: Rendam potongan kulit pisang ke dalam larutan air garam 2% atau air kapur sirih selama 20–30 menit. Larutan garam dan kapur sirih sangat ampuh menetralkan getah dan senyawa tanin yang menimbulkan rasa kelat/pahit di lidah.\n3. Perebusan dan penirisan: Rebus potongan kulit pisang sebentar selama 5 menit untuk melunakkan teksturnya, lalu tiriskan hingga airnya kering.\n4. Pembalutan adonan tepung: Celupkan irisan kulit pisang ke dalam adonan tepung bumbu krispi (campuran tepung beras, tepung tapioka, bawang putih, ketumbar, dan garam).\n5. Penggorengan hingga renyah: Goreng dalam minyak panas melimpah (deep frying) dengan api sedang hingga berwarna kuning kecokelatan dan bertekstur sangat renyah.\n\nProspek ekonomi sirkular:\nOlahan keripik kulit pisang dapat dikemas dalam standing pouch kedap udara dengan berbagai varian rasa kekinian (pedas manis, barbeque, cokelat lumer, atau original). Produk ini membuktikan bahwa limbah dapur dapat diubah menjadi sumber pundi-pundi rupiah sekaligus mewujudkan zero waste production pada rantai pasok pisang.',
      category: 'OLAHAN' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/olah-kulit-pisang-jadi-keripik.jpg',
      rewardPoint: 20,
      estimatedReadingMinutes: 3,
      status: 'PUBLISHED' as const,
      authorId: SELLER_2_ID,
    },
    {
      type: 'ARTICLE' as const,
      title: 'Mengenal Ekonomi Sirkular Pertanian dan Cara Memulainya',
      slug: 'ekonomi-sirkular-pertanian',
      content: 'Selama beberapa dekade terakhir, sektor pertanian kerap terjebak dalam model ekonomi linier konvensional: "Ambil pupuk kimia dari alam, Tanami lahan, Panen komoditas, lalu Buang sisa biomassanya" (Take-Make-Dispose). Model usang ini mengakibatkan ribuan ton jerami dibakar, limbah kulit kopi dan sawit mencemari sungai, serta alat-alat pertanian bekas dibiarkan berkarat di sudut gudang. Konsep Ekonomi Sirkular Pertanian (Circular Agriculture) hadir mengubah paradigma tersebut secara mendasar: setiap sisa hasil pertanian bukan lagi sampah, melainkan sumber daya baru yang bernilai jika dialirkan kembali ke dalam rantai produksi.\n\nEmpat pilar utama ekonomi sirkular pertanian:\n1. Mereduksi limbah dari hulu: Perencanaan pola tanam dan aplikasi pemupukan presisi yang meminimalkan input kimia terbuang percuma.\n2. Memanfaatkan kembali (Reuse & Refurbish): Memperbaiki, merawat, dan memperjualbelikan alat serta mesin pertanian bekas yang masih layak guna agar tidak menjadi limbah besi tua.\n3. Mengolah limbah menjadi produk bernilai (Upcycling): Mendaur ulang sisa panen menjadi briket biomassa, kompos kasgot, pakan silase ternak berprotein, biochar sekam, hingga pestisida nabati.\n4. Mengembalikan hara ke siklus alam (Nutrient Loop): Mengembalikan kompos dan pupuk organik hasil daur ulang ke lahan yang sama guna memulihkan kesuburan biologis tanah untuk generasi mendatang.\n\nLangkah praktis petani memulai ekonomi sirkular mandiri:\nPetani tidak perlu menunggu teknologi canggih atau modal miliaran untuk memulai. Langkah kecil dan nyata dapat segera dipraktikkan hari ini: kumpulkan kotoran ternak dan jerami untuk dikomposkan, fermentasikan pakan ternak dari tebon jagung, daftarkan alat tani bekas yang tidak terpakai ke LoopTani Marketplace, dan pelajari praktik ramah lingkungan melalui Panduan Tani. Inilah masa depan pertanian Indonesia: mandiri pupuk, minim limbah, dan berkelanjutan.',
      category: 'LIMBAH' as const,
      difficulty: 'PEMULA' as const,
      imageUrl: '/images/panduan/ekonomi-sirkular-pertanian.jpg',
      rewardPoint: 30,
      estimatedReadingMinutes: 5,
      status: 'PUBLISHED' as const,
      authorId: SELLER_ID,
    },

  ];

  let knowledgeCount = 0;
  for (const item of KNOWLEDGE_DATA) {
    const existing = await prisma.knowledgeContent.findUnique({ where: { slug: item.slug } });
    if (existing) {
      await prisma.knowledgeContent.update({
        where: { id: existing.id },
        data: item,
      });
      console.log(`  🔄 Updated: [${item.type}] ${item.title}`);
    } else {
      await prisma.knowledgeContent.create({
        data: item,
      });
      knowledgeCount++;
      console.log(`  ✅ Created: [${item.type}] ${item.title}`);
    }
  }

  // ── 4. Seed Admin User ──────────────────────────────────────────────────────
  console.log('👤 Seeding admin user...');
  const adminEmail = 'admin@looptani.id';
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    console.log('   Creating new credentials admin account...');
    const res = await auth.api.signUpEmail({
      headers: new Headers(),
      body: {
        email: adminEmail,
        password: 'AdminPassword123!',
        name: 'Platform Admin',
      },
    });
    if (!res || !res.user) {
      throw new Error('Gagal melakukan pendaftaran admin via Better Auth');
    }
    adminUser = res.user as any;
  }

  // Ensure ADMIN role
  await prisma.userRole.upsert({
    where: { userId_role: { userId: adminUser!.id, role: 'ADMIN' } },
    update: {},
    create: { userId: adminUser!.id, role: 'ADMIN' },
  });

  // ── 5. Seed Categories ──────────────────────────────────────────────────────
  console.log('🏷️ Seeding categories...');
  const DEFAULT_CATEGORIES = [
    { name: 'Limbah Pertanian', slug: 'agricultural-waste', type: 'MARKETPLACE' as const },
    { name: 'Produk Olahan', slug: 'processed-product', type: 'MARKETPLACE' as const },
    { name: 'Alat Secondhand', slug: 'secondhand', type: 'MARKETPLACE' as const },
    { name: 'Limbah Organik', slug: 'limbah', type: 'LEARNING' as const },
    { name: 'Produk Olahan', slug: 'olahan', type: 'LEARNING' as const },
    { name: 'Alat & Mesin Tani', slug: 'alat', type: 'LEARNING' as const },
  ];

  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, type: cat.type },
      create: cat,
    });
  }

  // ── 6. Seed Rewards ────────────────────────────────────────────────────────
  console.log('🎁 Seeding rewards...');
  const DEFAULT_REWARDS = [
    {
      title: 'Bebas Biaya Layanan Penjual (Diskon 5%)',
      description: 'Potongan komisi administrasi toko sebesar 5% selama 30 hari.',
      pointsCost: 500,
      isActive: true,
    },
    {
      title: 'Voucher Belanja Rp20.000',
      description: 'Diskon belanja di Marketplace LoopTani sebesar Rp20.000.',
      pointsCost: 800,
      isActive: true,
    },
  ];

  for (const reward of DEFAULT_REWARDS) {
    const existingReward = await prisma.reward.findFirst({
      where: { title: reward.title },
    });
    if (!existingReward) {
      await prisma.reward.create({
        data: reward,
      });
    }
  }

  console.log();
  console.log('─'.repeat(50));
  console.log(`✨ Seed complete!`);
  console.log(`   👤 Sellers  : 2`);
  console.log(`   📚 Knowledge: ${knowledgeCount}`);
  console.log('─'.repeat(50));

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
