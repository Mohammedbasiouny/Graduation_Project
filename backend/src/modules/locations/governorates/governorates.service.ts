import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGovernorateDto, UpdateGovernorateDto } from './dto/index';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GovernoratesService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) { }

  private formatResponse(governorate: any) {
    return {
      id: governorate.id,
      name: governorate.name,
      distance_from_cairo: governorate.distanceFromCairo,
      is_visible: governorate.is_visible,
    };
  }
  // =============================================================
  // Create Governorate
  // ============================================================
  async create(createDto: CreateGovernorateDto) {
    try {
      const existingGovernorate = await this.prisma.governorate.findFirst({
        where: {
          name: createDto.name,
        },
      });
      if (existingGovernorate) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [
              this.il8n.translate('locations.governorates.ALREADY_EXISTS'),
            ],
          },
        });
      }

      const governorate = await this.prisma.governorate.create({
        data: {
          name: createDto.name,
          distanceFromCairo: createDto.distance_from_cairo ?? 0,
          is_visible: createDto.is_visible,
        },
      });
      return this.formatResponse(governorate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.governorates.CREATE_FAILED');
    }
  }

  // =============================================================
  // Find All Governorates
  // ============================================================
  async findAll(
    page: number = 1,
    pageSize: number = 20,
    withPagination: boolean = true,
  ) {
    try {
      if (!withPagination) {
        const governorates = await this.prisma.governorate.findMany({
          orderBy: { created_at: 'asc' },
          include: {
            _count: {
              select: {
                cities: true,
                policeDepartments: true,
                educationalDepartments: true,
              },
            },
          },
        });

        const formattedData = governorates.map((gov) => ({
          id: gov.id,
          name: gov.name,
          distance_from_cairo: gov.distanceFromCairo,
          is_visible: gov.is_visible,
          cities_count: gov._count.cities,
          police_stations_count: gov._count.policeDepartments,
          educational_departments_count: gov._count.educationalDepartments,
        }));

        return {
          data: formattedData,
          meta: {
            pagination: {
              page: 1,
              page_size: formattedData.length,
              total_pages: 1,
              total_items: formattedData.length,
            },
            search: null,
            filters: null,
            sorting: null,
          },
        };
      }

      // ================= WITH PAGINATION =================

      const skip = (page - 1) * pageSize;

      const [governorates, totalItems] = await this.prisma.$transaction([
        this.prisma.governorate.findMany({
          skip,
          take: pageSize,
          orderBy: { created_at: 'asc' },
          include: {
            _count: {
              select: {
                cities: true,
                policeDepartments: true,
                educationalDepartments: true,
              },
            },
          },
        }),
        this.prisma.governorate.count(),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      const formattedData = governorates.map((gov) => ({
        id: gov.id,
        name: gov.name,
        is_visible: gov.is_visible,
        distance_from_cairo: gov.distanceFromCairo,
        cities_count: gov._count.cities,
        police_stations_count: gov._count.policeDepartments,
        educational_departments_count: gov._count.educationalDepartments,
      }));

      return {
        data: formattedData,
        meta: {
          pagination: {
            page: page,
            page_size: pageSize,
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
      throw new InternalServerErrorException('locations.governorates.FETCH_FAILED');
    }
  }

  // =============================================================
  // Find One Governorate
  // ============================================================
  async findOne(id: number) {
    try {
      const governorate = await this.prisma.governorate.findUnique({
        where: { id },
      });
      if (!governorate) {
        throw new NotFoundException('locations.governorates.NOT_FOUND');
      }

      return this.formatResponse(governorate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.governorates.FETCH_FAILED');
    }
  }

  // =============================================================
  // Update Governorate
  // ============================================================
  async update(id: number, updateDto: UpdateGovernorateDto) {
    try {
      const existingGovernorate = await this.prisma.governorate.findUnique({
        where: { id },
      });
      if (!existingGovernorate) {
        throw new NotFoundException('locations.governorates.NOT_FOUND');
      }

      if (updateDto.name !== existingGovernorate.name) {
        const duplicateName = await this.prisma.governorate.findFirst({
          where: {
            name: updateDto.name,
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
                this.il8n.translate('locations.governorates.ALREADY_EXISTS'),
              ],
            },
          });
        }
      }
      const updatedGovernorate = await this.prisma.governorate.update({
        where: { id },
        data: {
          name: updateDto.name,
          distanceFromCairo: updateDto.distance_from_cairo,
          is_visible: updateDto.is_visible,
        },
      });
      return this.formatResponse(updatedGovernorate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.governorates.UPDATE_FAILED');
    }
  }

  // ===========================================================
  // Delete Governorate
  // ===========================================================
  async remove(id: number) {
    try {
      const governorate = await this.prisma.governorate.findUnique({
        where: { id },
        include: {
          cities: true,
          policeDepartments: true,
          educationalDepartments: true,
          students: true,
        },
      });
      if (!governorate) {
        throw new NotFoundException('locations.governorates.NOT_FOUND');
      }

      // Check for any linked records
      if (governorate.cities && governorate.cities.length > 0) {
        throw new ConflictException('locations.governorates.HAS_LINKED_CITIES');
      }

      if (governorate.policeDepartments && governorate.policeDepartments.length > 0) {
        throw new ConflictException('locations.governorates.HAS_LINKED_POLICE_DEPARTMENTS');
      }

      if (governorate.educationalDepartments && governorate.educationalDepartments.length > 0) {
        throw new ConflictException('locations.governorates.HAS_LINKED_EDUCATIONAL_DEPARTMENTS');
      }

      if (governorate.students && governorate.students.length > 0) {
        throw new ConflictException('locations.governorates.HAS_LINKED_STUDENTS');
      }

      await this.prisma.governorate.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.governorates.DELETE_FAILED');
    }
  }

  async getStatisticsAboutEgypt() {
    try {
      const totalGovernorates = await this.prisma.governorate.count();
      const totalCities = await this.prisma.citySheikhVillage.count();
      const totalPoliceStations = await this.prisma.policeDepartment.count();
      const totalEducationalDepartments = await this.prisma.educationalDepartment.count();

      return {
        governorates: totalGovernorates,
        cities: totalCities,
        police_stations: totalPoliceStations,
        educational_departments: totalEducationalDepartments,
      };
    } catch (error) {
      throw new InternalServerErrorException('locations.governorates.STATISTICS_FETCH_FAILED');
    }
  }
}
