// prisma/seeds/adminDivisions.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export default async function seedAdminDivisions(prisma: PrismaClient) {
  const filePath = path.join(__dirname, '..', 'data', 'egypt_administrative_divisions.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);
  const governorates = Array.isArray(data) ? data : data.governorates;

  let jsonCounts = {
    governorates: governorates.length,
    educationalDepartments: 0,
    policeDepartments: 0,
    cities: 0,
  };

  for (const gov of governorates) {
    // ========================
    // 1. Governorate
    // ========================
    let governorate;
    try {
      governorate = await prisma.governorate.create({
        data: {
          name: gov.governorate_name,
          distanceFromCairo: gov.distance_from_cairo ?? 0,
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        governorate = await prisma.governorate.findFirst({
          where: { name: gov.governorate_name },
        });
      } else {
        throw e;
      }
    }

    const govAcceptance = gov.acceptance_status ?? true;

    // ========================
    // 2. Educational Departments
    // ========================
    if (gov.educational_administrations) {
      jsonCounts.educationalDepartments += gov.educational_administrations.length;

      for (const edu of gov.educational_administrations) {
        const eduAcceptance =
          govAcceptance === false
            ? false
            : edu.acceptance_status !== false;

        const existingEdu = await prisma.educationalDepartment.findFirst({
          where: {
            name: edu.name,
            governorate_id: governorate!.id,
          },
        });

        if (!existingEdu) {
          await prisma.educationalDepartment.create({
            data: {
              name: edu.name,
              governorate_id: governorate!.id,
              acceptance_status: eduAcceptance,
            },
          });
        }
      }
    }

    // ========================
    // 3. Police Departments + Cities
    // ========================
    if (gov.police_departments_and_centers) {
      jsonCounts.policeDepartments += gov.police_departments_and_centers.length;

      for (const pd of gov.police_departments_and_centers) {

        let policeDepartment = await prisma.policeDepartment.findFirst({
          where: {
            name: pd.name,
            governorate_id: governorate!.id,
          },
        });

        if (!policeDepartment) {
          policeDepartment = await prisma.policeDepartment.create({
            data: {
              name: pd.name,
              governorate_id: governorate!.id,
              acceptance_status: govAcceptance,
            },
          });
        }

        // ========================
        // Cities / Sheikh Villages
        // ========================
        if (pd.cities_sheikhs_villages) {
          jsonCounts.cities += pd.cities_sheikhs_villages.length;

          for (const city of pd.cities_sheikhs_villages) {
            const existingCity = await prisma.citySheikhVillage.findFirst({
              where: {
                name: city.name,
                governorate_id: governorate!.id,
                police_department_id: policeDepartment.id,
              },
            });

            if (!existingCity) {
              await prisma.citySheikhVillage.create({
                data: {
                  name: city.name,
                  governorate_id: governorate!.id,
                  police_department_id: policeDepartment.id,
                },
              });
            }
          }
        }
      }
    }
  }

  console.log('🌱 Admin divisions seed completed');
}
