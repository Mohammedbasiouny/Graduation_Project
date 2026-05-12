import { PrismaClient, University } from '@prisma/client';

export default async function seedFacultiesAndDepartments(prisma: PrismaClient) {
  console.log('🌱 Seeding Faculties and Department Programs...');

  // ========================
  // Helwan University (hu) - 15 Faculties
  // ========================
  const huData = [
    {
      name: `كلية الهندسة (حلوان)`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `هندسة مدنية`,
        `هندسة ميكانيكية`,
        `هندسة القوى الكهربائية والآلات`,
        `هندسة الإلكترونيات والاتصالات`,
        `هندسة الحاسبات والنظم`,
        `الهندسة الطبية الحيوية`,
      ],
    },
    {
      name: `كلية الهندسة (المطرية)`,
      university: University.hu,
      is_off_campus: true,
      departments: [
        `هندسة معمارية`,
        `هندسة مدنية`,
        `هندسة ميكانيكية`,
        `هندسة كهربائية`,
      ],
    },
    {
      name: `كلية الطب`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `الطب الباطني`,
        `الجراحة`,
        `طب الأطفال`,
        `النساء والتوليد`,
        `الباثولوجيا الإكلينيكية`,
      ],
    },
    {
      name: `كلية الصيدلة`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `العلوم الصيدلانية`,
        `الصيدلة الإكلينيكية`,
        `الصيدلانيات`,
        `الكيمياء الصيدلانية`,
        `علم النبات الصيدلاني`,
      ],
    },
    {
      name: `كلية الحاسبات والذكاء الاصطناعي`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `علوم الحاسب`,
        `نظم المعلومات`,
        `الذكاء الاصطناعي`,
        `هندسة البرمجيات`,
        `علوم البيانات`,
      ],
    },
    {
      name: `كلية الفنون التطبيقية`,
      university: University.hu,
      is_off_campus: true,
      departments: [
        `تصميم داخلي`,
        `تصميم جرافيك`,
        `تصميم صناعي`,
        `تصميم المنسوجات`,
        `تصميم أزياء`,
        `تصميم السيراميك والزجاج`,
      ],
    },
    {
      name: `كلية الفنون الجميلة`,
      university: University.hu,
      is_off_campus: true,
      departments: [
        `التصوير`,
        `النحت`,
        `الجرافيك الفني`,
        `العمارة الداخلية`,
        `العمارة`,
      ],
    },
    {
      name: `كلية الآداب`,
      university: University.hu,
      is_off_campus: true,
      departments: [
        `اللغة العربية وآدابها`,
        `اللغة الإنجليزية وآدابها`,
        `التاريخ`,
        `الفلسفة`,
        `علم الاجتماع`,
        `الإعلام والاتصال`,
      ],
    },
    {
      name: `كلية العلوم`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `الرياضيات`,
        `الفيزياء`,
        `الكيمياء`,
        `علم الحيوان`,
        `علم النبات`,
        `الجيولوجيا`,
      ],
    },
    {
      name: `كلية التربية الرياضية (بنين)`,
      university: University.hu,
      is_off_campus: true,
      departments: [
        `التدريب الرياضي`,
        `الإدارة الرياضية`,
        `التربية البدنية`,
        `علم النفس الرياضي`,
      ],
    },
    {
      name: `كلية التربية الرياضية (بنات)`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `التربية البدنية`,
        `التدريب الرياضي`,
        `الجمباز والرقص`,
        `علوم الصحة الرياضية`,
      ],
    },
    {
      name: `كلية السياحة والفنادق`,
      university: University.hu,
      is_off_campus: true,
      departments: [
        `الدراسات السياحية`,
        `إدارة الفنادق`,
        `الإرشاد السياحي`,
      ],
    },
    {
      name: `كلية الاقتصاد المنزلي`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `التغذية وعلوم الأغذية`,
        `الملابس والمنسوجات`,
        `إدارة المنزل`,
        `تعليم وتنمية الطفل`,
      ],
    },
    {
      name: `كلية الخدمة الاجتماعية`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `ممارسة الخدمة الاجتماعية`,
        `التنمية المجتمعية`,
        `الخدمة الاجتماعية الطبية والنفسية`,
      ],
    },
    {
      name: `كلية الحقوق`,
      university: University.hu,
      is_off_campus: false,
      departments: [
        `القانون العام`,
        `القانون الخاص`,
        `القانون الجنائي`,
        `القانون الدولي`,
      ],
    },
  ];

  // ========================
  // Helwan National University (hnu) - 5 Faculties
  // ========================
  const hnuData = [
    {
      name: `كلية الهندسة`,
      university: University.hnu,
      is_off_campus: false,
      departments: [
        `هندسة الحاسبات`,
        `هندسة كهربائية`,
        `هندسة ميكانيكية`,
        `هندسة مدنية`,
        `النظم الذكية`,
      ],
    },
    {
      name: `كلية الطب`,
      university: University.hnu,
      is_off_campus: false,
      departments: [
        `العلوم الطبية الأساسية`,
        `الطب الإكلينيكي`,
        `الجراحة`,
        `طب الأطفال`,
      ],
    },
    {
      name: `كلية طب الفم والأسنان`,
      university: University.hnu,
      is_off_campus: false,
      departments: [
        `طب الفم وأمراض اللثة`,
        `جراحة الفم`,
        `تقويم الأسنان`,
        `تعويضات الأسنان`,
      ],
    },
    {
      name: `كلية العلوم`,
      university: University.hnu,
      is_off_campus: false,
      departments: [
        `الرياضيات`,
        `الفيزياء`,
        `الكيمياء`,
        `علم الأحياء`,
      ],
    },
    {
      name: `كلية إدارة الأعمال`,
      university: University.hnu,
      is_off_campus: false,
      departments: [
        `إدارة الأعمال`,
        `المحاسبة`,
        `التمويل والبنوك`,
        `التسويق`,
        `إدارة الموارد البشرية`,
      ],
    },
  ];

  // ========================
  // Helwan Institute of Technology University (hitu) - 1 Faculty
  // ========================
  const hituData = [
    {
      name: `كلية التكنولوجيا والعلوم التطبيقية`,
      university: University.hitu,
      is_off_campus: true,
      departments: [
        `هندسة الميكاترونيكس`,
        `الروبوتات والأتمتة`,
        `هندسة الأمن السيبراني`,
        `تكنولوجيا الطاقة المتجددة`,
        `الهندسة الصناعية`,
        `علوم البيانات والذكاء الاصطناعي`,
      ],
    },
  ];

  const allData = [...huData, ...hnuData, ...hituData];

  for (const item of allData) {
    // find or create faculty
    let faculty = await prisma.faculty.findFirst({
      where: {
        name: item.name,
        university: item.university,
      },
    });

    if (!faculty) {
      faculty = await prisma.faculty.create({
        data: {
          name: item.name,
          university: item.university,
          is_off_campus: item?.is_off_campus ?? false,
          is_visible: true,
        },
      });
    }

    for (const deptName of item.departments) {
      const existingDepartment = await prisma.departmentProgram.findFirst({
        where: {
          name: deptName,
          faculty_id: faculty.id,
        },
      });

      if (!existingDepartment) {
        await prisma.departmentProgram.create({
          data: {
            name: deptName,
            faculty_id: faculty.id,
            is_visible: true,
          },
        });
      } else {
        await prisma.departmentProgram.update({
          where: { id: existingDepartment.id },
          data: {
            faculty_id: faculty.id,
          },
        });
      }
    }
  }

  console.log('🌱 Faculties and Departments seeding completed successfully!');
}