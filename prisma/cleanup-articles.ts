import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const VALID_ARTICLE_SLUGS = [
  'poc-dari-limbah-dapur',
  'arang-sekam-biochar',
  'manfaat-mulsa-jerami',
  'kompos-kulit-kopi',
  'mengenal-pupuk-kandang',
  'tips-memilih-alat-pertanian-bekas',
  'merawat-cangkul-alat-tani-manual',
  'merawat-traktor-tangan-bekas',
  'hama-wereng-pengendalian-alami',
  'pengendalian-tikus-sawah',
  'deteksi-penyakit-layu-cabai',
  'pupuk-npk-dosis-padi',
  'pestisida-nabati-daun-mimba',
  'budidaya-cabai-rawit-pemula',
  'budidaya-tomat-organik-lahan-sempit',
  'sistem-tanam-jajar-legowo',
  'manfaat-rotasi-tanaman',
  'mengolah-singkong-tepung-mocaf',
  'olah-kulit-pisang-jadi-keripik',
  'ekonomi-sirkular-pertanian',
];

const OBSOLETE_VIDEO_SLUGS = [
  'praktik-briket-jerami',
  'proses-kompos-tkks',
  'tutorial-poc-limbah-buah',
  'demo-perawatan-traktor-tangan',
  'video-budidaya-bsf-maggot',
];

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  console.log('🧹 Cleaning up obsolete knowledge contents...');

  // 1. Delete any ARTICLE whose slug is not in VALID_ARTICLE_SLUGS
  const obsoleteArticles = await prisma.knowledgeContent.findMany({
    where: {
      type: 'ARTICLE',
      slug: { notIn: VALID_ARTICLE_SLUGS },
    },
    select: { id: true, slug: true, title: true },
  });

  console.log(`Found ${obsoleteArticles.length} obsolete articles:`);
  for (const a of obsoleteArticles) {
    console.log(`  - Deleting: ${a.slug} (${a.title})`);
    await prisma.knowledgeContent.delete({ where: { id: a.id } });
  }

  // 2. Delete the 5 dummy videos
  const obsoleteVideos = await prisma.knowledgeContent.findMany({
    where: {
      type: 'VIDEO',
      slug: { in: OBSOLETE_VIDEO_SLUGS },
    },
    select: { id: true, slug: true, title: true },
  });

  console.log(`Found ${obsoleteVideos.length} obsolete dummy videos:`);
  for (const v of obsoleteVideos) {
    console.log(`  - Deleting: ${v.slug} (${v.title})`);
    await prisma.knowledgeContent.delete({ where: { id: v.id } });
  }

  // 3. Ensure all 20 valid articles have correct local image URLs
  console.log('Verifying 20 valid articles imageUrl...');
  for (const slug of VALID_ARTICLE_SLUGS) {
    const expectedUrl = `/images/panduan/${slug}.webp`;
    await prisma.knowledgeContent.updateMany({
      where: { slug },
      data: { imageUrl: expectedUrl },
    });
  }

  const totalArticles = await prisma.knowledgeContent.count({ where: { type: 'ARTICLE' } });
  const totalVideos = await prisma.knowledgeContent.count({ where: { type: 'VIDEO' } });

  console.log(`\n✅ Done! Remaining in database:`);
  console.log(`   Articles: ${totalArticles} (Expected: 20)`);
  console.log(`   Videos:   ${totalVideos} (Expected: 18 YouTube videos)`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
