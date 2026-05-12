import { PrismaClient } from '@prisma/client';

export default async function seedStudentParents(
  prisma: PrismaClient
) {
  console.log('🌱 Seeding student parents info...');

  const random = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const parentsStatuses = [
    'both_alive',
    'father_deceased',
    'mother_deceased',
    'both_deceased',
    'divorced',
    'separated',
    'father_unknown',
    'mother_unknown',
    'guardian_only',
  ];

  // =========================
  // STUDENTS
  // =========================
  const students = await prisma.student.findMany({
    where: {
      isEgyptian: true,
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: true,
      guardianNationalId: {
        not: null,
      },
    },
    include: {
      user: true,
    },
    take: 2550,
  });

  console.log(`Found ${students.length} students`);

  // =========================
  // UPDATE
  // =========================
  const updates = students.map((student) =>
    prisma.student.update({
      where: { id: student.id },
      data: {
        parentsStatus: random(parentsStatuses),
        parentsOutsideEgypt: Math.random() < 0.35,
      },
    })
  );

  await prisma.$transaction(updates);

  console.log(`✅ Seeded parents info for ${students.length} students`);
}