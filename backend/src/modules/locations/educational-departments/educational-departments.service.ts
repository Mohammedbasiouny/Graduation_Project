import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEducationalDepartmentDto, UpdateEducationalDepartmentDto } from './dto/index';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EducationalDepartmentsService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) { }

  private formatResponse(educationalDepartment: any) {
    return {
      id: educationalDepartment.id,
      name: educationalDepartment.name,
      governorate_id: educationalDepartment.governorate_id,
      governorate_name: educationalDepartment.governorate?.name,
      acceptance_status: educationalDepartment.acceptance_status,
      is_visible: educationalDepartment.is_visible,
    };
  }

  // =============================================================
  // Create Educational Department
  // ============================================================
  async create(createDto: CreateEducationalDepartmentDto) {
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
              this.il8n.translate('locations.educational-departments.GOVERNORATE_NOT_FOUND'),
            ],
          },
        });
      }

      const existingDepartment = await this.prisma.educationalDepartment.findFirst({
        where: {
          name: createDto.name,
          governorate_id: createDto.governorate_id,
        },
      });
      if (existingDepartment) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [
              this.il8n.translate('locations.educational-departments.ALREADY_EXISTS'),
            ],
          },
        });
      }

      const educationalDepartment = await this.prisma.educationalDepartment.create({
        data: {
          name: createDto.name,
          governorate_id: createDto.governorate_id,
          is_visible: createDto.is_visible,
          acceptance_status: createDto.acceptance_status,
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
      return this.formatResponse(educationalDepartment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.educational-departments.CREATE_FAILED');
    }
  }

  // =============================================================
  // Find All Educational Departments
  // ============================================================
  async findAll(
    governorateId?: number,
    page: number = 1,
    pageSize: number = 20,
    withPagination: boolean = true,
  ) {
    try {
      const where = governorateId
        ? { governorate_id: governorateId }
        : {};

      // ================= WITHOUT PAGINATION =================
      if (!withPagination) {
        const educationalDepartments =
          await this.prisma.educationalDepartment.findMany({
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
            },
          });

        return {
          data: educationalDepartments.map((dept) =>
            this.formatResponse(dept),
          ),
          meta: {
            pagination: {
              page: 1,
              page_size: educationalDepartments.length,
              total_pages: 1,
              total_items: educationalDepartments.length,
            },
            search: null,
            filters: null,
            sorting: null,
          },
        };
      }

      // ================= WITH PAGINATION =================
      const skip = (page - 1) * pageSize;

      const [educationalDepartments, total] = await Promise.all([
        this.prisma.educationalDepartment.findMany({
          where,
          skip,
          take: pageSize,
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
          },
        }),
        this.prisma.educationalDepartment.count({ where }),
      ]);

      return {
        data: educationalDepartments.map((dept) =>
          this.formatResponse(dept),
        ),
        meta: {
          pagination: {
            page: page,
            page_size: pageSize,
            total_pages: Math.ceil(total / pageSize),
            total_items: total,
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

      throw new InternalServerErrorException(
        'locations.educational-departments.FETCH_FAILED',
      );
    }
  }


  // =============================================================
  // Find One Educational Department
  // ============================================================
  async findOne(id: number) {
    try {
      const educationalDepartment = await this.prisma.educationalDepartment.findUnique({
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
      if (!educationalDepartment) {
        throw new NotFoundException('locations.educational-departments.NOT_FOUND');
      }

      return this.formatResponse(educationalDepartment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.educational-departments.FETCH_FAILED');
    }
  }

  // =============================================================
  // Update Educational Department
  // ============================================================
  async update(id: number, updateDto: UpdateEducationalDepartmentDto) {
    try {
      const existingDepartment = await this.prisma.educationalDepartment.findUnique({
        where: { id },
      });
      if (!existingDepartment) {
        throw new NotFoundException('locations.educational-departments.NOT_FOUND');
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
              this.il8n.translate('locations.educational-departments.GOVERNORATE_NOT_FOUND'),
            ],
          },
        });
      }

      if (updateDto.name !== existingDepartment.name) {
        const duplicateName = await this.prisma.educationalDepartment.findFirst({
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
                this.il8n.translate('locations.educational-departments.ALREADY_EXISTS'),
              ],
            },
          });
        }
      }

      const updatedDepartment = await this.prisma.educationalDepartment.update({
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
      return this.formatResponse(updatedDepartment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.educational-departments.UPDATE_FAILED');
    }
  }

  // =============================================================
  // Remove Educational Department
  // ============================================================
  async remove(id: number) {
    try {
      const educationalDepartment = await this.prisma.educationalDepartment.findUnique({
        where: { id },
        include: {
          students: true,
        },
      });
      if (!educationalDepartment) {
        throw new NotFoundException('locations.educational-departments.NOT_FOUND');
      }

      if (educationalDepartment.students && educationalDepartment.students.length > 0) {
        throw new ConflictException('locations.educational-departments.HAS_LINKED_STUDENTS');
      }

      await this.prisma.educationalDepartment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('locations.educational-departments.DELETE_FAILED');
    }
  }
}