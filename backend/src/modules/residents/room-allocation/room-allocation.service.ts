import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRoomAllocationDto } from './dto/assign-room-allocation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RoomAllocationService {
  constructor(
    private prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async assignRoom(dto: CreateRoomAllocationDto, lang: string) {
    const { student_id, building_id, room_id, notes } = dto;

    // 1. Fetch only what we need to validate the move/assignment
    const [existingResident, student, building, targetRoom] = await Promise.all([
      this.prisma.resident.findFirst({ where: { student_id: student_id } }),
      this.prisma.student.findUnique({ where: { id: student_id }, select: { gender: true } }),
      this.prisma.building.findUnique({ where: { id: building_id }, select: { type: true } }),
      this.prisma.room.findUnique({ where: { id: room_id }, include: { _count: { select: { residents: true } } } }),
    ]);

    // 2. Basic Validations
    if (!student) throw new NotFoundException(this.i18n.t('allocation.errors.STUDENT_NOT_FOUND', { lang }));
    if (!building) throw new NotFoundException(this.i18n.t('allocation.errors.BUILDING_NOT_FOUND', { lang }));
    if (!targetRoom) throw new NotFoundException(this.i18n.t('allocation.errors.ROOM_NOT_FOUND', { lang }));

    // 3. Gender & Building Match Validation
    if (student.gender !== building.type) {
      throw new BadRequestException(this.i18n.t('allocation.errors.GENDER_MISMATCH', {
        lang,
        args: { studentGender: student.gender, buildingType: building.type },
      }));
    }

    if (targetRoom.building_id !== building_id) {
      throw new BadRequestException(this.i18n.t('allocation.errors.ROOM_BUILDING_MISMATCH', { lang }));
    }

    // 4. Capacity Validation
    const isAlreadyInThisRoom = existingResident?.room_id === room_id;
    if (!isAlreadyInThisRoom && targetRoom._count.residents >= targetRoom.capacity) {
      throw new BadRequestException(this.i18n.t('allocation.errors.ROOM_FULL', { lang }));
    }

    let resident;
    let messageKey;

    // 5. Execute Update or Create
    if (existingResident) {
      // UPDATE: We don't need the application data at all!
      resident = await this.prisma.resident.update({
        where: { id: existingResident.id },
        data: {
          building_id: building_id,
          room_id: room_id,
          notes: notes !== undefined ? notes : existingResident.notes,
        },
      });
      messageKey = 'allocation.success.UPDATED';

    } else {
      // CREATE: Now we fetch the application because we need its ID for the new Resident row
      const application = await this.prisma.studentApplication.findFirst({
        where: { studentId: student_id, status: 'accepted' },
        orderBy: { created_at: 'desc' },
      });

      if (!application) {
        throw new BadRequestException(this.i18n.t('allocation.errors.NO_ACCEPTED_APP', { lang }));
      }

      resident = await this.prisma.resident.create({
        data: {
          student_id: student_id,
          application_id: application.id, // Linked safely
          building_id: building_id,
          room_id: room_id,
          notes: notes,
          status: 'active',
          move_in_date: new Date(),
        },
      });
      messageKey = 'allocation.success.ASSIGNED';
    }

    return {
      message: this.i18n.t(messageKey, { lang }),
      resident,
    };
  }

  // =========================================================================
  // Standard View & Delete endpoints
  // =========================================================================

  async findAll() {
    return this.prisma.resident.findMany({
      include: {
        student: {
          select: {
            fullName: true,
            nationalId: true,
            studentIdCode: true,
            gender: true,
          }
        },
        building: {
          select: { name: true, type: true }
        },
        room: {
          select: { name: true, floor: true, type: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findOne(id: number, lang: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id },
      include: {
        student: true, // You might want to limit selected fields here too depending on frontend needs
        building: true,
        room: true,
        application: true
      }
    });

    if (!resident) {
      throw new NotFoundException(this.i18n.t('allocation.errors.ALLOCATION_NOT_FOUND', { lang }));
    }

    return resident;
  }

  async remove(id: number, lang: string) {
    try {
      await this.prisma.resident.delete({
        where: { id }
      });

      return {
        message: this.i18n.t('allocation.success.DELETED', { lang })
      };
    } catch (error) {
      // Prisma throws a specific error (P2025) if the record to delete doesn't exist
      throw new NotFoundException(this.i18n.t('allocation.errors.ALLOCATION_NOT_FOUND', { lang }));
    }
  }
}