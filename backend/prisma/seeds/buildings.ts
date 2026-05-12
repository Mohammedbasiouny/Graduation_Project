// prisma/seeds/buildings.ts
import { PrismaClient, RoomType, Gender } from '@prisma/client';

export default async function seedBuildings(prisma: PrismaClient) {
  const buildingCount = 10;
  const roomTypes: RoomType[] = ['regular', 'premium', 'medical', 'studying'];

  for (let i = 1; i <= buildingCount; i++) {
    const floors = Math.floor(Math.random() * 3) + 2; // 2 إلى 4 طوابق
    const buildingType: Gender = i % 2 === 0 ? 'female' : 'male';

    // إنشاء المبنى
    const building = await prisma.building.create({
      data: {
        name: `Building ${i}`,
        type: buildingType,
        floors_count: floors,
      },
    });

    // إنشاء الغرف لكل دور
    for (let floor = 1; floor <= floors; floor++) {
      const roomsOnFloor = Math.floor(Math.random() * 11) + 5; // 5 إلى 15 غرفة
      for (let r = 1; r <= roomsOnFloor; r++) {
        const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

        await prisma.room.create({
          data: {
            building_id: building.id,
            name: `${floor}0${r}`, // مثال: 101, 102, 201 ...
            type: roomType,
            floor: floor,
            capacity: roomType === 'regular' ? 1 : 2,
            description: `${roomType} room on floor ${floor}`,
            is_available_for_stay: roomType !== 'studying',
          },
        });
      }
    }
  }

  console.log(`🌱 Seeded ${buildingCount} buildings with random rooms`);
}