import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityDto, UpdateCityDto } from './dto/index';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly il8n: I18nService,
  ) { }

  private formatResponse(city: any) {
    return {
      id: city.id,
      name: city.name,
      governorate_id: city.governorate_id,
      governorate_name: city.governorate?.name,
      police_station_id: city.police_department_id,
      police_station_name: city.policeDepartment?.name,
      is_visible: city.is_visible,
    };
  }

  // =============================================================
  // Create City
  // ============================================================
  async create(createDto: CreateCityDto) {
    try {
      const governorate = await this.prisma.governorate.findUnique({
        where: { id: createDto.governorate_id },
      });
      if (!governorate) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            governorate_id: [
              this.il8n.translate('locations.cities.GOVERNORATE_NOT_FOUND'),
            ],
          },
        });
      }

      const policeDepartment = await this.prisma.policeDepartment.findUnique({
        where: { id: createDto.police_station_id },
      });
      if (!policeDepartment) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            police_station_id: [
              this.il8n.translate('locations.cities.POLICE_STATION_NOT_FOUND'),
            ],
          },
        });
      }

      const existingCity = await this.prisma.citySheikhVillage.findFirst({
        where: {
          name: createDto.name,
          governorate_id: createDto.governorate_id,
          police_department_id: createDto.police_station_id,
        },
      });
      if (existingCity) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [
              this.il8n.translate('locations.cities.ALREADY_EXISTS'),
            ],
          },
        });
      }

      const city = await this.prisma.citySheikhVillage.create({
        data: {
          name: createDto.name,
          governorate_id: createDto.governorate_id,
          police_department_id: createDto.police_station_id,
          is_visible: createDto.is_visible,
        },
        include: {
          governorate: {
            select: {
              id: true,
              name: true,
            },
          },
          policeDepartment: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return this.formatResponse(city);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.cities.CREATE_FAILED');
    }
  }

  // =============================================================
  // Find All Cities
  // ============================================================
  async findAll(
    governorateId?: number,
    policeStationId?: number,
    page: number = 1,
    pageSize: number = 20,
    withPagination: boolean = true,
  ) {
    try {
      const where: any = {};

      if (governorateId) {
        where.governorate_id = governorateId;
      }

      if (policeStationId) {
        where.police_department_id = policeStationId;
      }

      // ================= WITHOUT PAGINATION =================
      if (!withPagination) {
        const cities = await this.prisma.citySheikhVillage.findMany({
          where,
          orderBy: {
            created_at: 'asc',
          },
          include: {
            governorate: {
              select: {
                id: true,
                name: true,
              },
            },
            policeDepartment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return {
          data: cities.map((city) => this.formatResponse(city)),
          meta: {
            pagination: {
              page: 1,
              page_size: cities.length,
              total_pages: 1,
              total_items: cities.length,
            },
            search: null,
            filters: null,
            sorting: null,
          },
        };
      }

      // ================= WITH PAGINATION =================
      const safePage = Math.max(1, page);
      const safePageSize = Math.min(50, Math.max(1, pageSize));
      const skip = (safePage - 1) * safePageSize;

      const [cities, totalItems] = await this.prisma.$transaction([
        this.prisma.citySheikhVillage.findMany({
          where,
          skip,
          take: safePageSize,
          orderBy: {
            created_at: 'asc',
          },
          include: {
            governorate: {
              select: {
                id: true,
                name: true,
              },
            },
            policeDepartment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),

        this.prisma.citySheikhVillage.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / safePageSize);

      return {
        data: cities.map((city) => this.formatResponse(city)),
        meta: {
          pagination: {
            page: safePage,
            page_size: safePageSize,
            total_pages: totalPages,
            total_items: totalItems,
          },
          search: null,
          filters: null,
          sorting: null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.cities.FETCH_FAILED');
    }
  }


  // =============================================================
  // Find One City
  // ============================================================
  async findOne(id: number) {
    try {
      const city = await this.prisma.citySheikhVillage.findUnique({
        where: { id },
        include: {
          governorate: {
            select: {
              id: true,
              name: true,
            },
          },
          policeDepartment: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!city) {
        throw new NotFoundException('locations.cities.NOT_FOUND');
      }

      return this.formatResponse(city);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.cities.FETCH_FAILED');
    }
  }

  // =============================================================
  // Update City
  // ============================================================
  async update(id: number, updateDto: UpdateCityDto) {
    try {
      const existingCity = await this.prisma.citySheikhVillage.findUnique({
        where: { id },
      });
      if (!existingCity) {
        throw new NotFoundException('locations.cities.NOT_FOUND');
      }

      const governorate = await this.prisma.governorate.findUnique({
        where: { id: updateDto.governorate_id },
      });
      if (!governorate) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            governorate_id: [
              this.il8n.translate('locations.cities.GOVERNORATE_NOT_FOUND'),
            ],
          },
        });
      }

      const policeDepartment = await this.prisma.policeDepartment.findUnique({
        where: { id: updateDto.police_station_id },
      });
      if (!policeDepartment) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            police_station_id: [
              this.il8n.translate('locations.cities.POLICE_STATION_NOT_FOUND'),
            ],
          },
        });
      }

      if (updateDto.name !== existingCity.name) {
        const duplicateName = await this.prisma.citySheikhVillage.findFirst({
          where: {
            name: updateDto.name,
            governorate_id: updateDto.governorate_id,
            police_department_id: updateDto.police_station_id,
            id: { not: id },
          },
        });
        if (duplicateName) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              name: [
                this.il8n.translate('locations.cities.ALREADY_EXISTS'),
              ],
            },
          });
        }
      }

      const updatedCity = await this.prisma.citySheikhVillage.update({
        where: { id },
        data: {
          name: updateDto.name,
          governorate_id: updateDto.governorate_id,
          police_department_id: updateDto.police_station_id,
          is_visible: updateDto.is_visible,
        },
        include: {
          governorate: {
            select: {
              id: true,
              name: true,
            },
          },
          policeDepartment: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return this.formatResponse(updatedCity);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.cities.UPDATE_FAILED');
    }
  }

  // =============================================================
  // Remove City
  // ============================================================
  async remove(id: number) {
    try {
      const city = await this.prisma.citySheikhVillage.findUnique({
        where: { id },
        include: {
          students: true,
        },
      });
      if (!city) {
        throw new NotFoundException('locations.cities.NOT_FOUND');
      }

      if (city.students && city.students.length > 0) {
        throw new ConflictException('locations.cities.HAS_LINKED_STUDENTS');
      }

      await this.prisma.citySheikhVillage.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.cities.DELETE_FAILED');
    }
  }
}