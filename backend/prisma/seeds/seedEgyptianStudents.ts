import { PrismaClient, Gender } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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

const governorates = [
  '01','02','03','04','05','06','07','08','09','10',
  '11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27'
];

const random = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomCity = () => {
  const cities = [
    'Cairo','Alexandria','Giza','Mansoura',
    'Aswan','Luxor','Tanta','Zagazig',
  ];
  return random(cities);
};

const randomForeignCity = () => {
  const cities = [
    'Riyadh','Dubai','Khartoum',
    'Amman','Doha','Nairobi',
  ];
  return random(cities);
};

const generateDOB = (seed: number) => {
  const year = 2000 + (seed % 6);
  const month = (seed % 12) + 1;
  const day = (seed % 28) + 1;

  return new Date(Date.UTC(year, month - 1, day));
};

// =========================
// REAL EGYPTIAN NATIONAL ID
// =========================
const generateNationalId = (seed: number, dob: Date) => {
  const century = '3';

  const yy = String(dob.getUTCFullYear()).slice(2);
  const mm = String(dob.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dob.getUTCDate()).padStart(2, '0');

  const gov = governorates[seed % governorates.length];

  const serial = String(1000 + (seed % 9000));

  const checksum = String((seed * 7) % 10);

  return `${century}${yy}${mm}${dd}${gov}${serial}${checksum}`;
};

const generatePhone = (country: Country, seed: number) => {
  const local = `01${String(10000000 + seed)}`;
  return `${country.dial_code} ${local}`;
};

// =========================
// MAIN SEED
// =========================
export default async function seedEgyptianStudents(prisma: PrismaClient) {
  console.log('🌱 Seeding 1000 students...');

  // USERS
  const users = await prisma.user.findMany({
    where: {
      role: 'student',
      university: { not: null },
      student: null,
    },
    take: 3000,
  });

  // COUNTRIES
  const countriesPath = path.join(
    process.cwd(),
    'prisma/data/countries.json'
  );

  const countries: Country[] = JSON.parse(
    fs.readFileSync(countriesPath, 'utf-8')
  );

  // IMAGES
  const frontDir = path.join(
    process.cwd(),
    'prisma/data/front_national_ids'
  );

  const backDir = path.join(
    process.cwd(),
    'prisma/data/back_national_ids'
  );

  const frontImages = fs.readdirSync(frontDir);
  const backImages = fs.readdirSync(backDir);

  // =========================
  // STEP 1: STUDENTS
  // =========================
  const studentsData: any[] = [];

  let counter = 1;

  for (const user of users) {
    const country = random(countries);

    const dob = generateDOB(counter);
    const nationalId = generateNationalId(counter, dob);

    // clean rule instead of checking ID
    const isForeign = counter % 20 === 0; // 5% foreign students

    studentsData.push({
      userId: user.id,

      fullName: `Student ${counter}`,
      gender: counter % 2 === 0 ? Gender.male : Gender.female,
      religion: counter % 10 === 0 ? 'christian' : 'muslim',

      nationalId,

      dateOfBirth: dob,

      placeOfBirth: isForeign ? country.code : 'EG',
      birthCity: isForeign ? randomForeignCity() : randomCity(),

      nationality: 'EG',
      phoneNumber: generatePhone(country, counter),

      isEgyptian: true,
      personalInfoCompleted: true,
    });

    counter++;
  }

  await prisma.student.createMany({
    data: studentsData,
    skipDuplicates: true,
  });

  // =========================
  // STEP 2: FETCH STUDENTS (FK FIX)
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
  // STEP 3: DOCUMENTS
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

  const getExt = (file: string) => path.extname(file);

  // =========================
  // PERSONAL IMAGE DIR
  // =========================
  const personalImagesDir = path.join(
    process.cwd(),
    'prisma/data/personal_images'
  );

  for (const user of users) {
    const studentId = userToStudent.get(user.id);
    if (!studentId) continue;

    const studentDir = path.join(
      process.cwd(),
      `uploads/students/${studentId}`
    );

    ensureDir(studentDir);

    const frontImg = random(frontImages);
    const backImg = random(backImages);

    const frontExt = getExt(frontImg);
    const backExt = getExt(backImg);

    // =========================
    // DESTINATION FILES
    // =========================
    const personalFile = `personal_image.jpg`;
    const frontFile = `national_id_front${frontExt}`;
    const backFile = `national_id_back${backExt}`;

    const personalPath = path.join(studentDir, personalFile);
    const frontPath = path.join(studentDir, frontFile);
    const backPath = path.join(studentDir, backFile);

    // =========================
    // SOURCE FILES
    // =========================
    const frontSource = path.join(
      process.cwd(),
      'prisma/data/front_national_ids',
      frontImg
    );

    const backSource = path.join(
      process.cwd(),
      'prisma/data/back_national_ids',
      backImg
    );

    // =========================
    // PERSONAL IMAGE (BASED ON GENDER)
    // =========================
    const student = studentsData.find(s => s.userId === user.id);

    const personalSource =
      student?.gender === Gender.male
        ? path.join(personalImagesDir, 'personal_image_male.jpg')
        : path.join(personalImagesDir, 'personal_image_female.jpg');

    // =========================
    // SAFETY CHECK (OPTIONAL BUT RECOMMENDED)
    // =========================
    if (!fs.existsSync(personalSource)) {
      throw new Error(`Missing personal image: ${personalSource}`);
    }

    // =========================
    // COPY FILES
    // =========================
    copyFile(personalSource, personalPath);
    copyFile(frontSource, frontPath);
    copyFile(backSource, backPath);

    // =========================
    // DB RECORDS
    // =========================
    documents.push(
      {
        student_id: studentId,
        document_type: 'personal_image',
        file_path: `/uploads/students/${studentId}/${personalFile}`,
      },
      {
        student_id: studentId,
        document_type: 'national_id_front',
        file_path: `/uploads/students/${studentId}/${frontFile}`,
      },
      {
        student_id: studentId,
        document_type: 'national_id_back',
        file_path: `/uploads/students/${studentId}/${backFile}`,
      }
    );
  }

  await prisma.document.createMany({
    data: documents,
    skipDuplicates: true,
  });

  // =========================
  // DONE
  // =========================
  console.log(`✅ Seeded ${studentsData.length} students`);
  console.log(`📄 Seeded ${documents.length} documents`);
}