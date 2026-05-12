import { PrismaClient, Gender } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// =========================
// TYPES
// =========================
type Country = {
  name_en: string;
  dial_code: string;
  code: string;
  flag: string;
  name_ar: string;
};

// =========================
// HELPERS
// =========================
const random = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const generateDOB = (seed: number) => {
  const year = 2000 + (seed % 6);
  const month = (seed % 12) + 1;
  const day = (seed % 28) + 1;

  return new Date(Date.UTC(year, month - 1, day));
};

const generatePassportNumber = (seed: number) => {
  return `P${100000000 + seed}`;
};

const generatePhone = (country: Country, seed: number) => {
  const local = `${100000000 + seed}`;
  return `${country.dial_code} ${local}`;
};

const randomCity = () => {
  const cities = [
    'Riyadh',
    'Dubai',
    'Khartoum',
    'Amman',
    'Doha',
    'Nairobi',
    'Casablanca',
    'Algiers',
  ];
  return random(cities);
};

// =========================
// MAIN SEED
// =========================
export default async function seedNonEgyptianStudents(
  prisma: PrismaClient
) {
  console.log('🌱 Seeding 1000 non-egyptian students...');

  // USERS
  const users = await prisma.user.findMany({
    where: {
      role: 'student',
      university: { not: null },
      student: null,
    },
    take: 1000,
  });

  // COUNTRIES
  const countriesPath = path.join(
    process.cwd(),
    'prisma/data/countries.json'
  );

  const countries: Country[] = JSON.parse(
    fs.readFileSync(countriesPath, 'utf-8')
  );

  // =========================
  // STEP 1: STUDENTS
  // =========================
  const studentsData: any[] = [];

  let counter = 1;

  for (const user of users) {
    const country = random(countries);

    const dob = generateDOB(counter);

    studentsData.push({
      userId: user.id,

      fullName: `Foreign Student ${counter}`,

      religion: counter % 10 === 0 ? 'christian' : 'muslim',

      gender:
        counter % 2 === 0 ? Gender.male : Gender.female,

      passportIssuingCountry: country.code,
      nationality: country.code,

      passportNumber: generatePassportNumber(counter),

      phoneNumber: generatePhone(country, counter),

      dateOfBirth: dob,

      placeOfBirth: randomCity(),

      isEgyptian: false,
      personalInfoCompleted: true,
    });

    counter++;
  }

  await prisma.student.createMany({
    data: studentsData,
    skipDuplicates: true,
  });

  // =========================
  // FETCH CREATED STUDENTS
  // =========================
  const createdStudents = await prisma.student.findMany({
    where: {
      userId: {
        in: users.map((u) => u.id),
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });

  const userToStudent = new Map<number, number>();

  for (const s of createdStudents) {
    userToStudent.set(s.userId, s.id);
  }

  // =========================
  // DOCUMENTS
  // =========================
  const documents: any[] = [];

  const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

  const copyFile = (from: string, to: string) => {
    fs.copyFileSync(from, to);
  };

  // =========================
  // IMAGES
  // =========================
  const personalImagesDir = path.join(
    process.cwd(),
    'prisma/data/personal_images'
  );

  const visaImage = path.join(
    process.cwd(),
    'prisma/data/visa_image.jpeg'
  );

  for (const user of users) {
    const studentId = userToStudent.get(user.id);
    if (!studentId) continue;

    const studentDir = path.join(
      process.cwd(),
      `uploads/students/${studentId}`
    );

    ensureDir(studentDir);

    const personalFile = `personal_image.jpg`;
    const passportFile = `passport_image.jpeg`;

    const personalPath = path.join(studentDir, personalFile);
    const passportPath = path.join(studentDir, passportFile);

    const student = studentsData.find(
      (s) => s.userId === user.id
    );

    const personalSource =
      student?.gender === Gender.male
        ? path.join(
            personalImagesDir,
            'personal_image_male.jpg'
          )
        : path.join(
            personalImagesDir,
            'personal_image_female.jpg'
          );

    copyFile(personalSource, personalPath);
    copyFile(visaImage, passportPath);

    documents.push(
      {
        student_id: studentId,
        document_type: 'personal_image',
        file_path: `/uploads/students/${studentId}/${personalFile}`,
      },
      {
        student_id: studentId,
        document_type: 'passport_image',
        file_path: `/uploads/students/${studentId}/${passportFile}`,
      }
    );
  }

  await prisma.document.createMany({
    data: documents,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${studentsData.length} students`);
  console.log(`📄 Seeded ${documents.length} documents`);
}