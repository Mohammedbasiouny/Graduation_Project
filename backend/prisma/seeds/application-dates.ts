import { PrismaClient, StudentType } from '@prisma/client';

export default async function seedApplicationDates(prisma: PrismaClient) {
  const DAY = 24 * 60 * 60 * 1000;
  const PERIOD_DAYS = 10;
  const GAP_DAYS = 1;

  const now = new Date();
  const periods: any[] = [];

  const createPeriod = (
    name: string,
    startAt: Date,
    studentType: StudentType
  ) => {
    const endAt = new Date(startAt.getTime() + PERIOD_DAYS * DAY);

    periods.push({
      name,
      startAt,
      endAt,
      university: "all",
      studentType,
    });

    return new Date(endAt.getTime() + GAP_DAYS * DAY);
  };

  // ================= BUILD =================

  // Start in the past
  let cursor = new Date(now.getTime() - 45 * DAY);

  // 1️⃣ OLD
  cursor = createPeriod(
    "Old Students",
    cursor,
    StudentType.old
  );

  // 2️⃣ NEW
  cursor = createPeriod(
    "New Students",
    cursor,
    StudentType.new
  );

  // 3️⃣ ALL
  cursor = createPeriod(
    "All Students",
    cursor,
    StudentType.all
  );

  // 4️⃣ CURRENT (ALL)
  const currentStart = new Date(now.getTime() - 2 * DAY);

  cursor = createPeriod(
    "Current - All Students",
    currentStart,
    StudentType.all
  );

  // 5️⃣ COMING (ALL)
  const comingStart = new Date(
    currentStart.getTime() + (PERIOD_DAYS + GAP_DAYS) * DAY
  );

  createPeriod(
    "Coming - All Students",
    comingStart,
    StudentType.all
  );

  // ================= INSERT =================

  for (const period of periods) {
    await prisma.applicationDate.create({
      data: period,
    });
  }

  console.log(`🌱 Seeded ${periods.length} application periods`);
}