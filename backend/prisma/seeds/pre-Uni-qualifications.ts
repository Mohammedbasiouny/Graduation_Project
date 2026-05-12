import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export default async function seedPreUniversityQualifications(prisma: PrismaClient) {
  const filePath = path.join(__dirname, '..', 'data', 'academic_specialist.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const qualifications: { specialist_name: string }[] = JSON.parse(rawData);

  for (const qual of qualifications) {
    // نتأكد إذا الاسم موجود بالفعل
    const existing = await prisma.preUniversityQualification.findFirst({
      where: { name: qual.specialist_name },
    });

    if (!existing) {
      await prisma.preUniversityQualification.create({
        data: {
          name: qual.specialist_name,
          degree: 0,
        },
      });
    }
  }

  console.log(`🌱 Seeded ${qualifications.length} pre-university qualifications`);
}