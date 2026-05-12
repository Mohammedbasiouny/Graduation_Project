import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export default async function seedStudentResidency(
  prisma: PrismaClient
) {
  console.log('🌱 Seeding student residency data...');

  // =========================
  // GET STUDENTS
  // =========================
  const egyptians = await prisma.student.findMany({
    where: { isEgyptian: true, residencyInfoCompleted: false },
    take: 2800,
  });

  const foreigners = await prisma.student.findMany({
    where: { isEgyptian: false, residencyInfoCompleted: false },
    take: 900,
  });

  // split inside/outside
  const egyptInside = egyptians.slice(0, 2700);
  const egyptOutside = egyptians.slice(2700);

  const foreignInside = foreigners.slice(0, 800);
  const foreignOutside = foreigners.slice(800);

  // =========================
  // LOAD GEO DATA
  // =========================
  const governorates = await prisma.governorate.findMany({
    where: { is_visible: true },
    include: {
      policeDepartments: {
        include: {
          cities: true,
        },
      },
    },
  });

  const random = (arr: any[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const getRandomEgyptAddress = () => {
    const gov = random(governorates);

    const police = random(gov.policeDepartments);

    const cities = police.cities.filter(
      (c) =>
        c.governorate_id === gov.id &&
        c.police_department_id === police.id
    );

    const city = random(cities);

    return {
      governorateId: gov.id,
      policeDepartmentId: police.id,
      cityId: city.id,
    };
  };

  // =========================
  // COUNTRIES
  // =========================
  const countries = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'prisma/data/countries.json'),
      'utf-8'
    )
  );

  // =========================
  // IMAGE
  // =========================
  const visaImage = path.join(
    process.cwd(),
    'prisma/data/visa_or_residency_image.jpg'
  );

  const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

  const copyFile = (from: string, to: string) => {
    fs.copyFileSync(from, to);
  };

  const documents: any[] = [];

  // =========================
  // INSIDE EGYPT
  // =========================
  const insideStudents = [...egyptInside, ...foreignInside];

  for (const student of insideStudents) {
    const address = getRandomEgyptAddress();

    await prisma.student.update({
      where: { id: student.id },
      data: {
        is_inside_egypt: true,
        countryOfResidence: 'EG',
        governorateId: address.governorateId,
        policeDepartmentId: address.policeDepartmentId,
        cityId: address.cityId,
        fullAddress: `Street ${student.id}, Building ${
          student.id % 100
        }`,
        residencyInfoCompleted: true,
      },
    });
  }

  // =========================
  // OUTSIDE EGYPT
  // =========================
  const outsideStudents = [...egyptOutside, ...foreignOutside];

  for (const student of outsideStudents) {
    const country =
      countries[Math.floor(Math.random() * countries.length)];

    await prisma.student.update({
      where: { id: student.id },
      data: {
        is_inside_egypt: false,
        countryOfResidence: country.code,
        fullAddress: `Address ${student.id} - ${country.name_en}`,
        residencyInfoCompleted: true,
      },
    });

    const studentDir = path.join(
      process.cwd(),
      `uploads/students/${student.id}`
    );

    ensureDir(studentDir);

    const fileName = 'visa_or_residency_image.jpg';
    const dest = path.join(studentDir, fileName);

    copyFile(visaImage, dest);

    documents.push({
      student_id: student.id,
      document_type: 'visa_or_residency_image',
      file_path: `/uploads/students/${student.id}/${fileName}`,
    });
  }

  // =========================
  // SAVE DOCUMENTS
  // =========================
  await prisma.document.createMany({
    data: documents,
    skipDuplicates: true,
  });

  console.log(
    `✅ Residency seeded: ${insideStudents.length + outsideStudents.length}`
  );
}