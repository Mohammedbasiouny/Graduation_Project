import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export default async function seedStudentAcademic(
  prisma: PrismaClient
) {
  console.log('🌱 Seeding student academic data...');

  // =========================
  // GET STUDENTS
  // =========================
  const egyptians = await prisma.student.findMany({
    where: { 
      isEgyptian: true, 
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: false,
    },
    include: {
      user: true,
    },
    take: 2700,
  });

  const foreigners = await prisma.student.findMany({
    where: { 
      isEgyptian: false, 
      personalInfoCompleted: true,
      residencyInfoCompleted: true,
      academicInfoCompleted: false,
    },
    include: {
      user: true,
    },
    take: 800,
  });

  const students = [...egyptians, ...foreigners]

  // shuffle
  const shuffled = students.sort(() => Math.random() - 0.5);

  const oldStudents = shuffled.slice(0, 2450);
  const newStudents = shuffled.slice(2450);

  // =========================
  // LOAD FACULTIES
  // =========================
  const faculties = await prisma.faculty.findMany({
    where: { is_visible: true },
    include: {
      departmentPrograms: true,
    },
  });

  const random = (arr: any[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const academicYears = [
    'preparatory',
    'first_year',
    'second_year',
    'third_year',
    'fourth_year',
    'fifth_year',
    'sixth_year',
  ];

  const grades = [0, 1, 2, 3, 4];

  const enrollmentStatuses = [
    'enrolled',
    'new',
    'continuing',
    'deferred',
    'withdrawn',
    're_enrolled',
    'repeat_year',
    'transferred',
    'canceled',
    'dismissed',
    'graduated',
  ];

  const educationTypes = ['regular', 'credit_hours'];

  // =========================
  // HIGH SCHOOL DATA
  // =========================
  const governorates = await prisma.governorate.findMany({
    include: {
      educationalDepartments: true,
    },
  });

  const qualifications =
    await prisma.preUniversityQualification.findMany({
      where: { is_visible: true },
    });

  // =========================
  // IMAGES
  // =========================
  const enrollmentImage = path.join(
    process.cwd(),
    'prisma/data/uni_card.png'
  );

  const nominationImage = path.join(
    process.cwd(),
    'prisma/data/nomination_image.jpg'
  );

  const certificatesDir = path.join(
    process.cwd(),
    'prisma/data/certificats'
  );

  const certificateImages = fs.readdirSync(certificatesDir);

  const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true });
  };

  const copy = (from: string, to: string) =>
    fs.copyFileSync(from, to);

  const documents: any[] = [];

  // =========================
  // OLD STUDENTS
  // =========================
  for (const student of oldStudents) {
    const uni = student.user.university;

    const faculty = random(
      faculties.filter((f) => f.university === uni)
    );

    const department = random(faculty.departmentPrograms);

    const educationType = random(educationTypes);

    const totalGrade =
      educationType === 'credit_hours'
        ? Number((Math.random() * 4).toFixed(2))
        : Math.floor(Math.random() * 400);

    await prisma.student.update({
      where: { id: student.id },
      data: {
        is_new: false,
        facultyId: faculty.id,
        departmentId: department.id,
        academicYear: random(academicYears),
        studentIdCode: `STD${student.id}`,
        educationSystemType: educationType,
        grade: `${random(grades)}`,
        totalAcademicGrade: totalGrade,
        enrollmentStatus: random(enrollmentStatuses),
        academicInfoCompleted: true,
      },
    });

    // image
    const dir = `uploads/students/${student.id}`;
    ensureDir(dir);

    const file = `${dir}/enrollment_proof_image.png`;

    copy(enrollmentImage, file);

    documents.push({
      student_id: student.id,
      document_type: 'enrollment_proof_image',
      file_path: `/${file}`,
    });
  }

  // =========================
  // NEW STUDENTS
  // =========================
  for (const student of newStudents) {
    const uni = student.user.university;

    const faculty = random(
      faculties.filter((f) => f.university === uni)
    );

    const department = random(faculty.departmentPrograms);

    const fromEgypt = Math.random() > 0.15;

    let gov = null;
    let edu = null;

    if (fromEgypt) {
      gov = random(governorates);
      edu = random(
        gov.educationalDepartments.filter(
          (e) => e.governorate_id === gov.id
        )
      );
    }

    await prisma.student.update({
      where: { id: student.id },
      data: {
        is_new: true,
        facultyId: faculty.id,
        departmentId: department.id,
        admissionYear: "2024",
        academicInfoCompleted: true,

        highSchoolFromEgypt: fromEgypt,
        highSchoolTotalGrade: Math.floor(
          300 + Math.random() * 100
        ),
        highSchoolCountry: fromEgypt ? 'EG' : 'SA',

        highSchoolGovernorate: gov?.id ?? null,
        highSchoolEducationDistrictId: edu?.id ?? null,

        qualificationId: random(qualifications).id,

        percentage: Number(
          (70 + Math.random() * 30).toFixed(2)
        ),
      },
    });

    // =========================
    // FILES
    // =========================
    const dir = `uploads/students/${student.id}`;
    ensureDir(dir);

    // nomination
    const nomination =
      `${dir}/nomination_card_image.jpg`;

    copy(nominationImage, nomination);

    documents.push({
      student_id: student.id,
      document_type: 'nomination_card_image',
      file_path: `/${nomination}`,
    });

    // certificates (1 or 2)
    const count = Math.random() > 0.5 ? 2 : 1;

    for (let i = 0; i < count; i++) {
      const img = random(certificateImages);

      const name =
        i === 0
          ? 'pre_university_certificate'
          : 'pre_university_certificate_1';

      const dest = `${dir}/${name}${path.extname(
        img
      )}`;

      copy(`${certificatesDir}/${img}`, dest);

      documents.push({
        student_id: student.id,
        document_type: name,
        file_path: `/${dest}`,
      });
    }
  }

  // =========================
  // SAVE DOCUMENTS
  // =========================
  await prisma.document.createMany({
    data: documents,
    skipDuplicates: true,
  });

  console.log('✅ Academic seed completed');
}