import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePoliceDepartmentDto, UpdatePoliceDepartmentDto } from './dto/index';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PoliceDepartmentsService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) {}

  private formatResponse(policeDepartment: any) {
    return {
      id: policeDepartment.id,
      name: policeDepartment.name,
      governorate_id: policeDepartment.governorate_id,
      governorate_name: policeDepartment.governorate?.name,
      is_visible: policeDepartment.is_visible,
      acceptance_status: policeDepartment.acceptance_status,
    };
  }
  // =============================================================
  // Create Police Department
  // ============================================================
  async create(createDto: CreatePoliceDepartmentDto) {
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
              this.il8n.translate('locations.police-departments.GOVERNORATE_NOT_FOUND'),
            ],
          },
        });
      }

      const existingPoliceDepartment = await this.prisma.policeDepartment.findFirst({
        where: {
          name: createDto.name,
          governorate_id: createDto.governorate_id,
        },
      });
      if (existingPoliceDepartment) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [
              this.il8n.translate('locations.police-departments.ALREADY_EXISTS'),
            ],
          },
        });
      }

      const policeDepartment = await this.prisma.policeDepartment.create({
        data: {
          name: createDto.name,
          governorate_id: createDto.governorate_id,
          is_visible: createDto.is_visible,
          acceptance_status: createDto.acceptance_status,
        },
      });
      return this.formatResponse(policeDepartment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.police-departments.CREATE_FAILED');
    }
  }

  // =============================================================
  // Find One Police Department
  // ============================================================
  async findOne(id: number) {
    try {
      const policeDepartment = await this.prisma.policeDepartment.findUnique({
        where: { id },
        include: {
          governorate: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!policeDepartment) {
        throw new NotFoundException('locations.police-departments.NOT_FOUND');
      }

      return {
        ...this.formatResponse(policeDepartment),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.police-departments.FETCH_FAILED');
    }
  }

  // =============================================================
  // Update Police Department
  // ============================================================
  async update(id: number, updateDto: UpdatePoliceDepartmentDto) {
    try {
      const existingPoliceDepartment = await this.prisma.policeDepartment.findUnique({
        where: { id },
      });
      if (!existingPoliceDepartment) {
        throw new NotFoundException('locations.police-departments.NOT_FOUND');
      }

      const governorate = await this.prisma.governorate.findUnique({
        where: { 
          id: updateDto.governorate_id
          
        },
      });
      if (!governorate) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            governorate_id: [
              this.il8n.translate('locations.police-departments.GOVERNORATE_NOT_FOUND'),
            ],
          },
        });
      }

      if (updateDto.name !== existingPoliceDepartment.name) {
        const duplicateName = await this.prisma.policeDepartment.findFirst({
          where: {
            name: updateDto.name,
            governorate_id: updateDto.governorate_id,
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
                this.il8n.translate('locations.police-departments.ALREADY_EXISTS'),
              ],
            },
          });
        }
      }

      const updatedPoliceDepartment = await this.prisma.policeDepartment.update({
        where: { id },
        data: {
          name: updateDto.name,
          governorate_id: updateDto.governorate_id,
          is_visible: updateDto.is_visible,
          acceptance_status: updateDto.acceptance_status,
        },
        include: {
          governorate: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return {
        ...this.formatResponse(updatedPoliceDepartment),
        governorate: updatedPoliceDepartment.governorate,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.police-departments.UPDATE_FAILED');
    }
  }

  // =============================================================
  // Remove Police Department
  // ============================================================
  async remove(id: number) {
    try {
      const policeDepartment = await this.prisma.policeDepartment.findUnique({
        where: { id },
        include: {
          cities: true,
          students: true,
        },
      });
      if (!policeDepartment) {
        throw new NotFoundException('locations.police-departments.NOT_FOUND');
      }

      if (policeDepartment.cities && policeDepartment.cities.length > 0) {
        throw new ConflictException('locations.police-departments.HAS_LINKED_CITIES');
      }

      if (policeDepartment.students && policeDepartment.students.length > 0) {
        throw new ConflictException('locations.police-departments.HAS_LINKED_STUDENTS');
      }

      await this.prisma.policeDepartment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.police-departments.DELETE_FAILED');
    }
  }

  // =============================================================
  // Get Police Stations by Governorate
  // ============================================================
  async getPoliceStations(
    page: number = 1,
    pageSize: number = 20,
    governorateId?: number,
    withPagination: boolean = true,
  ) {
    try {
      const where = governorateId ? { governorate_id: governorateId } : {};

      // ================= WITHOUT PAGINATION =================
      if (!withPagination) {
        const policeDepartments = await this.prisma.policeDepartment.findMany({
          where: {
            ...where,
          },
          orderBy: {
            created_at: 'asc',
          },
          include: {
            governorate: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                cities: true,
              },
            },
          },
        });

        const formattedData = policeDepartments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          acceptance_status: dept.acceptance_status,
          governorate_id: dept.governorate_id,
          governorate_name: dept.governorate?.name || null,

          cities_count: dept._count.cities,
          is_visible: dept.is_visible,
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

      const [policeDepartments, totalItems] = await this.prisma.$transaction([
        this.prisma.policeDepartment.findMany({
          where: {
            ...where,
          },
          skip,
          take: pageSize,
          orderBy: {
            created_at: 'asc',
          },
          include: {
            governorate: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                cities: true,
              },
            },
          },
        }),

        this.prisma.policeDepartment.count({
          where: {
            ...where,
          },
        }),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      const formattedData = policeDepartments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        acceptance_status: dept.acceptance_status,
        governorate_id: dept.governorate_id,
        governorate_name: dept.governorate?.name || null,
        cities_count: dept._count.cities,
        is_visible: dept.is_visible,
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
      console.error('Error fetching police stations:', error);
      throw new InternalServerErrorException('locations.police-departments.POLICE_STATIONS_FETCH_FAILED');
    }
  }
}
