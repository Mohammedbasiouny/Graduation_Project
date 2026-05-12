import { PrismaClient } from '@prisma/client';

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default async function seedStudentsCreatedAtByPeriods(
  prisma: PrismaClient
) {
  console.log('🌱 Distributing students across application periods...');

  const now = new Date();

  // =========================
  // 1. GET FIRST 4 PERIODS
  // =========================
  const periods = await prisma.applicationDate.findMany({
    orderBy: { startAt: 'asc' },
    take: 4,
  });

  if (periods.length < 4) {
    console.log('⚠️ Need at least 4 periods');
    return;
  }

  const [oldPeriod, newPeriod, allPeriod, currentPeriod] = periods;

  // =========================
  // 2. GET STUDENTS
  // =========================
  let students = await prisma.student.findMany({
    select: {
      id: true,
      is_new: true,
    },
  });

  const newStudents = shuffle(students.filter(s => s.is_new));
  const oldStudents = shuffle(students.filter(s => !s.is_new));

  const updates: any[] = [];

  // =========================
  // DISTRIBUTION HELPER
  // =========================
  const assignStudents = (studentsList: any[], period: any) => {
    const rangeStart = new Date(period.startAt);
    const rangeEnd =
      period.endAt > now ? now : new Date(period.endAt);

    const range = rangeEnd.getTime() - rangeStart.getTime();

    console.log(`📌 ${period.name} → ${studentsList.length} students`);

    for (const student of studentsList) {
      const randomOffset = Math.floor(Math.random() * range);

      const createdAt = new Date(
        rangeStart.getTime() + randomOffset
      );

      updates.push(
        prisma.student.update({
          where: { id: student.id },
          data: {
            applied_at: createdAt,
          },
        })
      );
    }
  };

  // =========================
  // 3. SPLIT LOGIC
  // =========================

  // 1️⃣ old period → only old
  assignStudents(oldStudents.slice(0, Math.ceil(oldStudents.length / 2)), oldPeriod);

  // 2️⃣ new period → only new
  assignStudents(newStudents.slice(0, Math.ceil(newStudents.length / 2)), newPeriod);

  // remaining students
  const remainingOld = oldStudents.slice(Math.ceil(oldStudents.length / 2));
  const remainingNew = newStudents.slice(Math.ceil(newStudents.length / 2));

  const mixed = shuffle([...remainingOld, ...remainingNew]);

  const half = Math.ceil(mixed.length / 2);

  // 3️⃣ all period
  assignStudents(mixed.slice(0, half), allPeriod);

  // 4️⃣ current period
  assignStudents(mixed.slice(half), currentPeriod);

  // =========================
  // 4. EXECUTE
  // =========================
  const BATCH = 500;

  for (let i = 0; i < updates.length; i += BATCH) {
    await prisma.$transaction(updates.slice(i, i + BATCH));
  }

  console.log(`✅ Updated ${updates.length} students`);
}