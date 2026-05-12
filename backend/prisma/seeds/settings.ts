import { PrismaClient } from '@prisma/client';

export default async function seedSettings(prisma: PrismaClient) {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      restaurant_status: true,
      application_period_open: true,
      application_period_open_changed_at: new Date('2026-01-01T22:00:00Z'),
      auto_meal_reserve: false,
      admission_results_announced: false,
      university_housing_started: false,
      female_visits_available: false,
      online_payment_available: false,

      attendance_start: new Date('1970-01-01T22:00:00Z'),
      attendance_end: new Date('1970-01-01T01:00:00Z'),
    },
  });
}