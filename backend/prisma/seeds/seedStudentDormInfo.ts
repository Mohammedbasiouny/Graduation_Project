import { PrismaClient } from '@prisma/client';

export default async function seedStudentDormInfo(
  prisma: PrismaClient
) {
  console.log('🌱 Seeding student dormitory info...');

  const random = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  // =========================
  // STUDENTS WITH MEDICAL REVIEW
  // =========================

  const EGstudents = await prisma.student.findMany({
    where: {
      isEgyptian: true,
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: true,
      guardianNationalId: { not: null },
      parentsStatus: { not: null },
      medicalReviews: {
        isNot: null, // ✅ Correct for 1-to-1
      },
    },
    include: {
      user: true,
      medicalReviews: true, 
    },
    take: 2450,
  });

  const EXstudents = await prisma.student.findMany({
    where: {
      isEgyptian: false,
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: true,
      medicalReviews: {
        isNot: null, // ✅ Fixed: Changed from some: {} to isNot: null
      },
    },
    include: {
      user: true,
      medicalReviews: true, 
    },
    take: 700,
  });

  // =========================
  // MERGE + SHUFFLE
  // =========================
  const students = [...EGstudents, ...EXstudents].sort(
    () => Math.random() - 0.5
  );

  console.log(`Found ${students.length} students`);

  // =========================
  // UPDATE
  // =========================
  const updates = students.map((student) =>
    prisma.student.update({
      where: { id: student.id },
      data: {
        dormType: random(['regular', 'premium']),
        requiresMeals: Math.random() < 0.65,
      },
    })
  );

  // =========================
  // SAFE BATCH UPDATE
  // =========================
  const chunkSize = 500;

  for (let i = 0; i < updates.length; i += chunkSize) {
    await prisma.$transaction(updates.slice(i, i + chunkSize));
  }

  console.log(
    `✅ Seeded dorm info for ${students.length} students`
  );
}