import { PrismaClient } from '@prisma/client';

export default async function seedMedicalReviews(
  prisma: PrismaClient
) {
  console.log('🌱 Seeding medical reviews...');

  // =========================
  // HELPERS
  // =========================
  const randomBool = (chance = 0.2) => Math.random() < chance;

  const random = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const mentalScale = [
    'always',
    'sometimes',
    'rarely',
    'never',
  ];

  const randomDetails = (max = 499) => {
    const texts = [
      'Patient is under periodic medical supervision and follows prescribed medication regularly with stable condition reported during last examination.',
      'Condition reported by guardian with no recent complications; student is able to perform daily activities normally with occasional monitoring required.',
      'Medical history indicates mild symptoms that appear intermittently; no hospitalization required and student remains academically active.',
      'Student previously diagnosed and currently stable; continues preventive care and attends routine checkups as advised by physician.',
      'No serious complications reported; condition managed with lifestyle adjustments and occasional medication when necessary.',
      'History of condition noted in medical records; currently not affecting academic performance or social adaptation.',
      'Student reported previous symptoms but no ongoing treatment required; monitoring recommended only if symptoms reappear.',
      'Guardian confirms medical condition is controlled; no limitations in physical or academic participation.',
      'Follow-up recommended every six months; condition does not require hospitalization or special accommodation.',
      'Symptoms are mild and appear occasionally; student is able to adapt to academic and social environments normally.',
    ];

    let result = '';

    while (result.length < max) {
      result += random(texts) + ' ';
      if (result.length > max) break;
    }

    return result.slice(0, max);
  };

  // =========================
  // STUDENTS
  // =========================
  const EGstudents = await prisma.student.findMany({
    where: {
      isEgyptian: true,
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: true,
      guardianNationalId: { not: null },
      parentsStatus: { not: null },
    },
    include: {
      user: true,
    },
    take: 2500,
  });
  const EXstudents = await prisma.student.findMany({
    where: {
      isEgyptian: false,
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: true,
    },
    include: {
      user: true,
    },
    take: 750,
  });

  const students = [...EGstudents, ...EXstudents]

  console.log(`Found ${students.length} students`);

  // =========================
  // DATA
  // =========================
  const medicalData = students.map((student) => {
    const blood_pressure = randomBool();
    const diabetes = randomBool();
    const heart_disease = randomBool();
    const immune_diseases = randomBool();
    const mental_health = randomBool();
    const other_diseases = randomBool();
    const mental_health_treatment = randomBool();
    const receiving_treatment = randomBool();
    const allergies = randomBool();
    const special_needs = randomBool();

    return {
      student_id: student.id,
      user_id: student.userId,

      blood_pressure,
      blood_pressure_details: blood_pressure ? randomDetails() : null,

      diabetes,
      diabetes_details: diabetes ? randomDetails() : null,

      heart_disease,
      heart_disease_details: heart_disease ? randomDetails() : null,

      immune_diseases,
      immune_diseases_details: immune_diseases
        ? randomDetails()
        : null,

      mental_health,
      mental_health_details: mental_health
        ? randomDetails()
        : null,

      other_diseases,
      other_diseases_details: other_diseases
        ? randomDetails()
        : null,

      mental_health_treatment,
      mental_health_treatment_details:
        mental_health_treatment
          ? randomDetails()
          : null,

      receiving_treatment,
      receiving_treatment_details: receiving_treatment
        ? randomDetails()
        : null,

      allergies,
      allergies_details: allergies ? randomDetails() : null,

      special_needs,
      special_needs_details: special_needs
        ? randomDetails()
        : null,

      // boolean only
      adapt_to_new_environments: randomBool(0.85),
      prefer_solitude: randomBool(0.25),
      behavioral_problems: randomBool(0.08),
      suspension_history: randomBool(0.05),
      shared_room_adaptation: randomBool(0.9),
      social_support: randomBool(0.75),
      stimulants_or_sedatives: randomBool(0.05),
      social_media_usage: randomBool(0.95),

      // mental scale
      sadness_without_reason: random(mentalScale),
      anxiety_or_stress: random(mentalScale),
      concentration_difficulty: random(mentalScale),
      sleep_problems: random(mentalScale),
      loss_of_interest: random(mentalScale),
      self_harm_thoughts: random(mentalScale),
      appetite_changes: random(mentalScale),
      anger_outbursts: random(mentalScale),
    };
  });

  // =========================
  // INSERT
  // =========================
  await prisma.medicalReview.createMany({
    data: medicalData,
    skipDuplicates: true,
  });

  console.log(
    `✅ Medical reviews created: ${medicalData.length}`
  );
}