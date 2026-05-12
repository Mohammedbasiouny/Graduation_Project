// prisma/seeds/users.ts
import { PrismaClient, Role, University } from '@prisma/client';
import * as argon from 'argon2';

export default async function seedUsers(prisma: PrismaClient) {
  const password = await argon.hash('Password@123');

  // helper to generate fake egyptian national id (14 digits)
  const generateSSN = (seed: number) => {
    const century = '3'; // 2000s

    // random birth date (2000 - 2005)
    const year = String(2000 + (seed % 6)).slice(2);
    const month = String((seed % 12) + 1).padStart(2, '0');
    const day = String((seed % 28) + 1).padStart(2, '0');

    // Cairo = 01 (valid governorate)
    const governorate = '01';

    // serial (4 digits)
    const serial = String(1000 + (seed % 9000));

    // checksum (fake but valid length)
    const checksum = String(seed % 10);

    return BigInt(
      `${century}${year}${month}${day}${governorate}${serial}${checksum}`,
    );
  };

  // ===== BASE USERS =====
  const users = [
    // ADMINS
    {
      full_name: 'Super Admin one',
      email: 'admin@gmail.com',
      role: Role.admin,
      ssn: generateSSN(1),
      university: null,
    },
    {
      full_name: 'Super Admin two',
      email: 'admin2@gmail.com',
      role: Role.admin,
      ssn: generateSSN(2),
      university: null,
    },

    // OTHER ROLES
    {
      full_name: 'Supervisor User',
      email: 'supervisor@gmail.com',
      role: Role.supervisor,
      ssn: generateSSN(3),
      university: null,
    },
    {
      full_name: 'Cafeteria User',
      email: 'cafeteria@gmail.com',
      role: Role.cafeteria,
      ssn: generateSSN(4),
      university: null,
    },
    {
      full_name: 'Maintenance User',
      email: 'maintenance@gmail.com',
      role: Role.maintenance,
      ssn: generateSSN(5),
      university: null,
    },
    {
      full_name: 'Medical User',
      email: 'medical@gmail.com',
      role: Role.medical,
      ssn: generateSSN(6),
      university: null,
    },
    {
      full_name: 'Admin Assistant',
      email: 'admin.assistant@gmail.com',
      role: Role.admin,
      ssn: generateSSN(7),
      university: null,
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: {
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        ssn: user.ssn,
        password_hash: password,
        isActive: true,
        end_date: null,
        university: user.university,
      },
    });
  }

  // =========================
  // STUDENTS
  // =========================
  const students = [];

  const createStudents = (
    count: number,
    university: University,
    prefix: string,
  ) => {
    for (let i = 0; i < count; i++) {
      students.push({
        full_name: null,
        email: `${prefix}_student_${i + 1}@example.com`,
        role: Role.student,
        ssn: null,
        password_hash: password,
        isActive: true,
        end_date: null,
        university,
      });
    }
  };

  // 7500 HU
  createStudents(3500, University.hu, 'hu');

  // 2000 HNU
  createStudents(400, University.hnu, 'hnu');

  // 500 HITU
  createStudents(200, University.hitu, 'hitu');

  // bulk insert (FAST)
  await prisma.user.createMany({
    data: students,
    skipDuplicates: true,
  });

  console.log('🌱 Seeded 7 users + 10000 students');
}
