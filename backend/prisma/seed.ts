import { PrismaClient } from '@prisma/client';

import seedAdminDivisions from './seeds/admin-divisions';
import seedBuildings from './seeds/buildings';
import seedPreUniversityQualifications from './seeds/pre-Uni-qualifications';
import seedUsers from './seeds/users';
import seedSettings from './seeds/settings';
import seedFacultiesAndDepartments from './seeds/faculties';
import seedApplicationDates from './seeds/application-dates';
import seedEgyptianStudents from './seeds/seedEgyptianStudents';
import * as fs from 'fs';
import * as path from 'path';
import seedNonEgyptianStudents from './seeds/seedNonEgyptianStudents';
import seedStudentResidency from './seeds/seedStudentResidency';
import seedStudentAcademic from './seeds/seedStudentAcademic';
import seedStudentGuardian from './seeds/seedStudentGuardian';
import seedStudentParents from './seeds/seedStudentParents';
import seedMedicalReviews from './seeds/seedMedicalReviews';
import seedStudentDormInfo from './seeds/seedStudentDormInfo';
import seedStudentsCreatedAtByPeriods from './seeds/seedApplicationDatesWithStudents';
import seedMeals from './seeds/seedMeals';

const prisma = new PrismaClient();

// =========================
// CLEAN UP FUNCTION
// =========================
const removeUploadsFolder = () => {
  const uploadsPath = path.join(process.cwd(), 'uploads/students');

  if (fs.existsSync(uploadsPath)) {
    fs.rmSync(uploadsPath, {
      recursive: true,
      force: true,
    });

    console.log('🧹 Cleaned uploads/students folder');
  } else {
    console.log('ℹ️ No uploads/students folder found');
  }
};

// =========================
// MAIN
// =========================
async function main() {
  console.log('🚀 Starting full database seed...');

  // =========================
  // STEP 0: CLEAN FILE SYSTEM
  // =========================
  removeUploadsFolder();

  // =========================
  // STEP 1: DATABASE SEEDS
  // =========================
  console.log('🌱 Seeding admin divisions...');
  await seedAdminDivisions(prisma);

  console.log('🌱 Seeding buildings...');
  await seedBuildings(prisma);

  console.log('🌱 Seeding pre-university qualifications...');
  await seedPreUniversityQualifications(prisma);

  console.log('🌱 Seeding users...');
  await seedUsers(prisma);

  console.log('🌱 Seeding settings...');
  await seedSettings(prisma);

  console.log('🌱 Seeding faculties & departments...');
  await seedFacultiesAndDepartments(prisma);

  console.log('🌱 Seeding meals...');
  await seedMeals(prisma);

  console.log('🌱 Seeding application dates...');
  await seedApplicationDates(prisma);

  console.log('🌱 Seeding students...');
  await seedEgyptianStudents(prisma);
  await seedNonEgyptianStudents(prisma);
  await seedStudentResidency(prisma);
  await seedStudentAcademic(prisma);
  await seedStudentGuardian(prisma);
  await seedStudentParents(prisma);
  await seedMedicalReviews(prisma);
  await seedStudentDormInfo(prisma);
  await seedStudentsCreatedAtByPeriods(prisma);

  console.log('�🎉 All seeds completed successfully');
}

// =========================
// EXECUTION
// =========================
main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });