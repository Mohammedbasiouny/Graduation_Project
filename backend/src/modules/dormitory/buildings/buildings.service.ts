import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { Gender } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class BuildingsService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) {}

  // ===========================================================
  // Format Response
  // ===========================================================
  private formatResponse(building: any) {
    return {
      id: building.id,
      name: building.name,
      type: building.type,
      floors_count: building.floors_count,
      is_available_for_stay: building.is_available_for_stay,
      rooms_count: building._count?.rooms ?? 0,
      regular_rooms_count: building.rooms?.filter((r: any) => r.type === 'regular').length ?? 0,
      premium_rooms_count: building.rooms?.filter((r: any) => r.type === 'premium').length ?? 0,
      medical_rooms_count: building.rooms?.filter((r: any) => r.type === 'medical').length ?? 0,
      studying_rooms_count: building.rooms?.filter((r: any) => r.type === 'studying').length ?? 0,
    };
  }

  // ===========================================================
  // Create Building
  // ===========================================================
  async create(createDto: CreateBuildingDto) {
    try {
      const existing = await this.prisma.building.findFirst({
        where: { name: createDto.name },
      });
      if (existing) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [this.il8n.translate('dormitory.buildings.ALREADY_EXISTS')],
          },
        });
      }

      const building = await this.prisma.building.create({
        data: {
          name: createDto.name,
          type: createDto.type,
          floors_count: createDto.floors_count,
          is_available_for_stay: createDto.is_available_for_stay,
        },
        include: {
          rooms: true,
          _count: { select: { rooms: true } },
        },
      });

      return this.formatResponse(building);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.buildings.CREATE_FAILED');
    }
  }

  // ===========================================================
  // Get All Buildings (with filters + pagination)
  // ===========================================================
  async findAll(options: {
    type?: string;
    available?: boolean | undefined;
    page: number;
    pageSize: number;
    withPagination: boolean;
  }) {
    try {
      const { type, available, page, pageSize, withPagination } = options;

      // ── Build where clause ──────────────────────────────────
      const where: any = {};

      // Type filter: only apply if value is exactly 'male' or 'female'
      if (type === 'male' || type === 'female') {
        where.type = type as Gender;
      }

      // Availability filter: only apply if the param was explicitly passed
      if (available !== undefined) {
        where.is_available_for_stay = available;
      }

      // ── Global statistics ──────────
      const [maleCount, femaleCount] = await this.prisma.$transaction([
        this.prisma.building.count({ where: { type: 'male' } }),
        this.prisma.building.count({ where: { type: 'female' } }),
      ]);

      const statistics = {
        male_buildings_count: maleCount,
        female_buildings_count: femaleCount,
      };

      // ── Include for room counts ──────────────────────────────
      const include = {
        rooms: true,
        _count: { select: { rooms: true } },
      };

      // ── WITHOUT PAGINATION ───────────────────────────────────
      if (!withPagination) {
        const items = await this.prisma.building.findMany({
          where,
          include,
          orderBy: { created_at: 'asc' },
        });

        return {
          data: {
            buildings: items.map((b) => this.formatResponse(b)),
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
        this.prisma.building.findMany({
          where,
          include,
          skip,
          take: pageSize,
          orderBy: { created_at: 'asc' },
        }),
        this.prisma.building.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: {
          buildings: items.map((b) => this.formatResponse(b)),
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
            { key: 'type', value: type ?? 'all' },
            { key: 'available', value: available ?? null },
          ],
          search: null,
          sorting: null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.buildings.FETCH_FAILED');
    }
  }

  // ===========================================================
  // Get One Building by ID
  // ===========================================================
  async findOne(id: number) {
    try {
      const building = await this.prisma.building.findUnique({
        where: { id },
        include: {
          rooms: true,
          _count: { select: { rooms: true } },
        },
      });

      if (!building) {
        throw new NotFoundException('dormitory.buildings.NOT_FOUND');
      }

      return this.formatResponse(building);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.buildings.FETCH_FAILED');
    }
  }

  // ===========================================================
  // Update Building
  // ===========================================================
  async update(id: number, updateDto: UpdateBuildingDto) {
    try {
      const existing = await this.prisma.building.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('dormitory.buildings.NOT_FOUND');
      }

      if (updateDto.name && updateDto.name !== existing.name) {
        const duplicate = await this.prisma.building.findFirst({
          where: { name: updateDto.name, id: { not: id } },
        });
        if (duplicate) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              name: [this.il8n.translate('dormitory.buildings.ALREADY_EXISTS')],
            },
          });
        }
      }

      const updated = await this.prisma.building.update({
        where: { id },
        data: {
          name: updateDto.name,
          type: updateDto.type,
          floors_count: updateDto.floors_count,
          is_available_for_stay: updateDto.is_available_for_stay,
        },
        include: {
          rooms: true,
          _count: { select: { rooms: true } },
        },
      });

      return this.formatResponse(updated);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.buildings.UPDATE_FAILED');
    }
  }

  // ===========================================================
  // Delete Building
  // ===========================================================
  async remove(id: number) {
    try {
      const building = await this.prisma.building.findUnique({
        where: { id },
        include: { rooms: true },
      });

      if (!building) {
        throw new NotFoundException('dormitory.buildings.NOT_FOUND');
      }

      if (building.rooms && building.rooms.length > 0) {
        throw new ConflictException('dormitory.buildings.HAS_LINKED_RECORDS');
      }

      await this.prisma.building.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('dormitory.buildings.DELETE_FAILED');
    }
  }
}