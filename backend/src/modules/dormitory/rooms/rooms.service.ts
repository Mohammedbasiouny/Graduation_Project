import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomType } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) {}

  // ===========================================================
  // Format Response
  // ===========================================================
  private formatResponse(room: any) {
    return {
      id: room.id,
      building_id: room.building_id,
      building_name: room.building?.name ?? null,
      building_type: room.building?.type ?? null,
      building_available_for_stay: room.building?.is_available_for_stay ?? null,
      name: room.name,
      type: room.type,
      floor: room.floor,
      capacity: room.capacity,
      description: room.description ?? null,
      is_available_for_stay: room.is_available_for_stay,
    };
  }

  // ===========================================================
  // Create Room
  // ===========================================================
  async create(createDto: CreateRoomDto) {
    try {
      // Validate building exists
      const building = await this.prisma.building.findUnique({
        where: { id: createDto.building_id },
      });

      if (!building) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            building_id: [
              this.il8n.translate('dormitory.buildings.NOT_FOUND'),
            ],
          },
        });
      }

      // Validate floor does not exceed building floors
      if (createDto.floor > building.floors_count) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            floor: [
              this.il8n.translate(
                'dormitory.rooms.FLOOR_EXCEEDS_BUILDING_FLOORS',
              ),
            ],
          },
        });
      }

      // check duplicate room in same building
      const existing = await this.prisma.room.findFirst({
        where: {
          name: createDto.name,
          building_id: createDto.building_id,
        },
      });

      if (existing) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [
              this.il8n.translate(
                'dormitory.rooms.ALREADY_EXISTS_IN_BUILDING',
              ),
            ],
          },
        });
      }

      const room = await this.prisma.room.create({
        data: {
          building_id: createDto.building_id,
          name: createDto.name,
          type: createDto.type,
          floor: createDto.floor,
          capacity: createDto.capacity,
          description: createDto.description,
          is_available_for_stay: createDto.is_available_for_stay,
        },
        include: {
          building: true,
        },
      });

      return this.formatResponse(room);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'dormitory.rooms.CREATE_FAILED',
      );
    }
  }

  // ===========================================================
  // Get All Rooms (with filters + pagination)
  // ===========================================================
  async findAll(options: {
    buildingId?: number;
    type?: string;
    available?: boolean | undefined;
    page: number;
    pageSize: number;
    withPagination: boolean;
  }) {
    try {
      const { buildingId, type, available, page, pageSize, withPagination } = options;

      // ── Build where clause ──────────────────────────────────
      const where: any = {};

      if (buildingId) {
        where.building_id = buildingId;
      }

      if (type === 'regular' || type === 'premium' || type === 'medical') {
        where.type = type as RoomType;
      }

      if (available !== undefined) {
        where.is_available_for_stay = available;
      }

      const include = { building: true };

      // ── Global statistics (unaffected by filters) ───────────
      const [regularCount, premiumCount, medicalCount, studyingCount] =
        await this.prisma.$transaction([
          this.prisma.room.count({ where: { building_id: buildingId, type: 'regular' } }),
          this.prisma.room.count({ where: { building_id: buildingId, type: 'premium' } }),
          this.prisma.room.count({ where: { building_id: buildingId, type: 'medical' } }),
          this.prisma.room.count({ where: { building_id: buildingId, type: 'studying' } }),
        ],
      );

      const statistics = {
        regular_rooms_count: regularCount,
        premium_rooms_count: premiumCount,
        medical_rooms_count: medicalCount,
        studying_rooms_count: studyingCount,
      };

      // ── WITHOUT PAGINATION ───────────────────────────────────
      if (!withPagination) {
        const items = await this.prisma.room.findMany({
          where,
          include,
          orderBy: { created_at: 'asc' },
        });

        return {
          data: {
            rooms: items.map((r) => this.formatResponse(r)),
            statistics,
          },
          meta: {
            pagination: {
              page: 1,
              page_size: items.length,
              total_pages: 1,
              total_items: items.length,
            },
            filters: [
              { key: 'building_id', value: buildingId ?? null },
              { key: 'type', value: type ?? 'all' },
              { key: 'available', value: available ?? null },
            ],
            search: null,
            sorting: null,
          },
        };
      }

      // ── WITH PAGINATION ──────────────────────────────────────
      const skip = (page - 1) * pageSize;

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.room.findMany({
          where,
          include,
          skip,
          take: pageSize,
          orderBy: { created_at: 'asc' },
        }),
        this.prisma.room.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: {
          rooms: items.map((r) => this.formatResponse(r)),
          statistics,
        },
        meta: {
          pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
            total_items: totalItems,
          },
          filters: [
            { key: 'building_id', value: buildingId ?? null },
            { key: 'type', value: type ?? 'all' },
            { key: 'available', value: available ?? null },
          ],
          search: null,
          sorting: null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.rooms.FETCH_FAILED');
    }
  }

  // ===========================================================
  // Get One Room by ID
  // ===========================================================
  async findOne(id: number) {
    try {
      const room = await this.prisma.room.findUnique({
        where: { id },
        include: { building: true },
      });

      if (!room) {
        throw new NotFoundException('dormitory.rooms.NOT_FOUND');
      }

      return this.formatResponse(room);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.rooms.FETCH_FAILED');
    }
  }

  // ===========================================================
  // Update Room
  // ===========================================================
  async update(id: number, updateDto: UpdateRoomDto) {
    try {
      const existing = await this.prisma.room.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('dormitory.rooms.NOT_FOUND');
      }

      // determine target values after update
      const targetBuildingId =
        updateDto.building_id ?? existing.building_id;

      const targetFloor =
        updateDto.floor ?? existing.floor;

      // check building exists
      const building = await this.prisma.building.findUnique({
        where: { id: targetBuildingId },
      });

      if (!building) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            building_id: [
              this.il8n.translate('dormitory.buildings.NOT_FOUND'),
            ],
          },
        });
      }

      // validate floor within building floors
      if (targetFloor > building.floors_count) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            floor: [
              this.il8n.translate(
                'dormitory.rooms.FLOOR_EXCEEDS_BUILDING_FLOORS',
              ),
            ],
          },
        });
      }

      // check duplicate only if name or building changed
      if (
        updateDto.name !== undefined ||
        updateDto.building_id !== undefined
      ) {
        const duplicate = await this.prisma.room.findFirst({
          where: {
            name: updateDto.name ?? existing.name,
            building_id: targetBuildingId,
            id: { not: id },
          },
        });

        if (duplicate) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              name: [
                this.il8n.translate(
                  'dormitory.rooms.ALREADY_EXISTS_IN_BUILDING',
                ),
              ],
            },
          });
        }
      }

      const updated = await this.prisma.room.update({
        where: { id },
        data: {
          building_id: updateDto.building_id,
          name: updateDto.name,
          type: updateDto.type,
          floor: updateDto.floor,
          capacity: updateDto.capacity,
          description: updateDto.description,
          is_available_for_stay: updateDto.is_available_for_stay,
        },
        include: {
          building: true,
        },
      });

      return this.formatResponse(updated);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'dormitory.rooms.UPDATE_FAILED',
      );
    }
  }

  // ===========================================================
  // Delete Room
  // ===========================================================
  async remove(id: number) {
    try {
      const room = await this.prisma.room.findUnique({ where: { id } });

      if (!room) {
        throw new NotFoundException('dormitory.rooms.NOT_FOUND');
      }

      await this.prisma.room.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.rooms.DELETE_FAILED');
    }
  }
}