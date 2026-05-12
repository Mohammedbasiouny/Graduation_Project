const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.settings.findFirst({ select: { id: true } });

  if (existing) {
    console.log('✅ Settings row already exists');
    return;
  }

  await prisma.settings.create({
    data: {
      restaurant_status: true,
      application_period_open: true,
      application_period_open_changed_at: new Date(),
      auto_meal_reserve: false,
      admission_results_announced: false,
      university_housing_started: false,
      female_visits_available: false,
      online_payment_available: false,
      attendance_start: new Date('1970-01-01T08:00:00Z'),
      attendance_end: new Date('1970-01-01T23:59:00Z'),
    },
  });

  console.log('✅ Created default settings row');
}

main()
  .catch((error) => {
    console.error('❌ Failed to ensure settings row:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
