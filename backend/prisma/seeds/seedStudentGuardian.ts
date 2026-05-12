import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

type Country = {
  name_en: string;
  dial_code: string;
  code: string;
  flag: string;
  name_ar: string;
};

const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const governorateCodes = [
  '01','02','03','04','05','06','07','08','09','10',
  '11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27',
];

const ARABIC_OCCUPATIONS = [
  'مهندس', 'طبيب', 'محاسب', 'معلم', 'موظف حكومي',
  'تاجر', 'محامي', 'مقاول', 'ضابط', 'فلاح',
  'سائق', 'ميكانيكي', 'نجار', 'كهربائي', 'صيدلاني',
];

const ARABIC_RELATIONSHIPS = ['أب', 'أم', 'أخ', 'عم', 'خال', 'جد'];

const FOREIGN_OCCUPATIONS = ['رجل أعمال', 'مستثمر', 'دبلوماسي', 'أستاذ جامعي', 'طبيب'];

const generateDOB = (seed: number) => {
  const year = 1960 + (seed % 30);
  const month = (seed % 12) + 1;
  const day = (seed % 28) + 1;
  return new Date(Date.UTC(year, month - 1, day));
};

const generateNationalId = (seed: number, dob: Date) => {
  const century = '2';
  const yy = String(dob.getUTCFullYear()).slice(2);
  const mm = String(dob.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dob.getUTCDate()).padStart(2, '0');
  const gov = governorateCodes[seed % governorateCodes.length];
  const serial = String(1000 + (seed % 9000));
  const checksum = String((seed * 7) % 10);
  return `${century}${yy}${mm}${dd}${gov}${serial}${checksum}`;
};

export default async function seedStudentGuardian(prisma: PrismaClient) {
  console.log('🌱 Seeding guardians...');

  const countriesPath = path.join(process.cwd(), 'prisma/data/countries.json');
  const countries: Country[] = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));

  const students = await prisma.student.findMany({
    where: {
      isEgyptian: true,
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: true,
    },
    take: 2600,
  });

  const egyptianGuardians = students.slice(0, 2500);
  const foreignGuardians = students.slice(2500);

  const updates: any[] = [];
  const documents: any[] = [];

  const ensureDir = (dir: string) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
  const copyFile = (from: string, to: string) => fs.copyFileSync(from, to);

  const frontDir = path.join(process.cwd(), 'prisma/data/front_national_ids');
  const backDir = path.join(process.cwd(), 'prisma/data/back_national_ids');
  const identityImage = path.join(process.cwd(), 'prisma/data/visa_image.jpeg');

  const frontImages = fs.readdirSync(frontDir);
  const backImages = fs.readdirSync(backDir);

  let counter = 1;

  // ── EGYPTIAN GUARDIANS ────────────────────────────────────────────────────
  for (const student of egyptianGuardians) {
    const dob = generateDOB(counter);
    const nationalId = generateNationalId(counter, dob);

    updates.push({
      id: student.id,
      isGuardianEgyptian: true,
      guardianName: `ولي أمر ${counter}`,
      guardianNationalId: nationalId,
      guardianOccupation: random(ARABIC_OCCUPATIONS),
      guardianPhoneNumber: `0100${1000000 + counter}`,
      guardianRelationship: random(ARABIC_RELATIONSHIPS),
      guardianNationality: 'EG',
    });

    const studentDir = path.join(process.cwd(), `uploads/students/${student.id}`);
    ensureDir(studentDir);

    const frontFile = 'guardian_id_front.jpg';
    const backFile = 'guardian_id_back.jpg';

    copyFile(path.join(frontDir, random(frontImages)), path.join(studentDir, frontFile));
    copyFile(path.join(backDir, random(backImages)), path.join(studentDir, backFile));

    documents.push(
      { student_id: student.id, document_type: 'guardian_id_front', file_path: `/uploads/students/${student.id}/${frontFile}` },
      { student_id: student.id, document_type: 'guardian_id_back', file_path: `/uploads/students/${student.id}/${backFile}` },
    );

    counter++;
  }

  // ── FOREIGN GUARDIANS ─────────────────────────────────────────────────────
  for (const student of foreignGuardians) {
    const country = random(countries);

    updates.push({
      id: student.id,
      isGuardianEgyptian: false,
      guardianName: `ولي أمر أجنبي ${counter}`,
      guardianNationality: country.code,
      guardianPhoneNumber: `${country.dial_code} ${100000000 + counter}`,
      guardianNationalId: `ID${100000000 + counter}`,
      guardianOccupation: random(FOREIGN_OCCUPATIONS),
      guardianRelationship: random(ARABIC_RELATIONSHIPS),
    });

    const studentDir = path.join(process.cwd(), `uploads/students/${student.id}`);
    ensureDir(studentDir);

    const file = 'guardian_identity.jpeg';
    copyFile(identityImage, path.join(studentDir, file));

    documents.push({
      student_id: student.id,
      document_type: 'guardian_identity',
      file_path: `/uploads/students/${student.id}/${file}`,
    });

    counter++;
  }

  for (const row of updates) {
    const { id, ...data } = row;
    await prisma.student.update({ where: { id }, data });
  }

  await prisma.document.createMany({ data: documents, skipDuplicates: true });

  console.log(`✅ Guardians seeded: ${updates.length}`);
  console.log(`📄 Documents seeded: ${documents.length}`);
}