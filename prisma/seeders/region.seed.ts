import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

interface RawProvince {
  id: string;
  name: string;
}

interface RawRegency {
  id: string;
  province_id: string;
  name: string;
}

interface RawDistrict {
  id: string;
  regency_id: string;
  name: string;
}

interface RawVillage {
  id: string;
  district_id: string;
  name: string;
}

export async function seedRegions(prisma: PrismaClient) {
  console.log('🗺️  Seeding regions data (Provinces, Regencies, Districts, Villages)...');

  const dataDir = path.join(__dirname, '../data');

  // 1. Read JSON files
  console.log('   Reading JSON data files...');
  const provincesData: RawProvince[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'provinces.json'), 'utf-8'),
  );
  const regenciesData: RawRegency[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'regencies.json'), 'utf-8'),
  );
  const districtsData: RawDistrict[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'districts.json'), 'utf-8'),
  );
  const villagesData: RawVillage[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'villages.json'), 'utf-8'),
  );

  // 2. Seed Provinces
  console.log(`   Seeding ${provincesData.length} Provinces...`);
  const provinces = provincesData.map((item) => ({
    id: String(item.id),
    name: item.name,
  }));
  await prisma.province.createMany({
    data: provinces,
    skipDuplicates: true,
  });

  // 3. Seed Regencies
  console.log(`   Seeding ${regenciesData.length} Regencies...`);
  const regencies = regenciesData.map((item) => ({
    id: String(item.id),
    provinceId: String(item.province_id),
    name: item.name,
  }));
  await prisma.regency.createMany({
    data: regencies,
    skipDuplicates: true,
  });

  // 4. Seed Districts
  console.log(`   Seeding ${districtsData.length} Districts...`);
  const districts = districtsData.map((item) => ({
    id: String(item.id),
    regencyId: String(item.regency_id),
    name: item.name,
  }));
  
  const DISTRICT_BATCH_SIZE = 5000;
  for (let i = 0; i < districts.length; i += DISTRICT_BATCH_SIZE) {
    const chunk = districts.slice(i, i + DISTRICT_BATCH_SIZE);
    await prisma.district.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  // 5. Seed Villages
  console.log(`   Seeding ${villagesData.length} Villages...`);
  const villages = villagesData.map((item) => ({
    id: String(item.id),
    districtId: String(item.district_id),
    name: item.name,
  }));

  const VILLAGE_BATCH_SIZE = 5000;
  for (let i = 0; i < villages.length; i += VILLAGE_BATCH_SIZE) {
    const chunk = villages.slice(i, i + VILLAGE_BATCH_SIZE);
    await prisma.village.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log('✅ Region master data seeded successfully!');
}
