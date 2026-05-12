import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/index';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class DepartmentsService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) {}

  private formatResponse(department: any) {
    return {
      id: department.id,
      name: department.name,
      faculty_id: department.faculty_id,
      faculty_name: department.faculty.name,
      university: department.faculty.university,
      is_visible: department.is_visible,
    };
  }

  // =============================================================
  // Create Department
  // =============================================================
  async create(createDto: CreateDepartmentDto) {
    try {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id: createDto.faculty_id },
      });
      if (!faculty) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            faculty_id: [this.il8n.translate('academics.departments.FACULTY_NOT_FOUND')],
          },
        });
      }

      const existingDepartment = await this.prisma.departmentProgram.findFirst(
        {
          where: {
            name: createDto.name,
            faculty_id: createDto.faculty_id,
          },
        },
      );
      if (existingDepartment) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [this.il8n.translate('academics.departments.ALREADY_EXISTS')],
          },
        });
      }

      const department = await this.prisma.departmentProgram.create({
        data: {
          name: createDto.name,
          faculty_id: createDto.faculty_id,
          is_visible: createDto.is_visible,
        },
        include: {
          faculty: {
            select: {
              id: true,
              name: true,
              university: true,
            },
          },
        },
      });

      return this.formatResponse(department);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('academics.departments.CREATE_FAILED');
    }
  }

  // ============================================================
  // Get All Departments
  // ============================================================
  async findAll(options: {
    facultyId?: number;
    page: number;
    pageSize: number;
    withPagination: boolean;
  }) {
    try {
      const { facultyId, page, pageSize, withPagination } = options;

      // ── Build where clause ──────────────────────────────────
      const where: any = {};

      if (facultyId) {
        where.faculty_id = facultyId;
      }

      const include = {
        faculty: {
          select: {
            id: true,
            name: true,
            university: true,
          },
        },
      };

      // ── WITHOUT PAGINATION ───────────────────────────────────
      if (!withPagination) {
        const items = await this.prisma.departmentProgram.findMany({
          where,
          include,
          orderBy: { created_at: 'asc' },
        });

        return {
          data: items.map((d) => this.formatResponse(d)),
          meta: {
            pagination: {
              page: 1,
              page_size: items.length,
              total_pages: 1,
              total_items: items.length,
            },
            filters: [
              { key: 'faculty_id', value: facultyId ?? null },
            ],
            search: null,
            sorting: null,
          },
        };
      }

      // ── WITH PAGINATION ──────────────────────────────────────
      const skip = (page - 1) * pageSize;

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.departmentProgram.findMany({
          where,
          include,
          skip,
          take: pageSize,
          orderBy: { created_at: 'asc' },
        }),
        this.prisma.departmentProgram.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: items.map((d) => this.formatResponse(d)),
        meta: {
          pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
            total_items: totalItems,
          },
          filters: [
            { key: 'faculty_id', value: facultyId ?? null },
          ],
          search: null,
          sorting: null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('Error fetching departments:', error);
      throw new InternalServerErrorException(
        'academics.departments.FETCH_FAILED',
      );
    }
  }

  // ===========================================================
  // Get Department by ID
  // ===========================================================
  async findOne(id: number) {
    try {
      const department = await this.prisma.departmentProgram.findUnique({
        where: { id },
        include: {
          faculty: {
            select: {
              id: true,
              name: true,
              university: true,
            },
          },
        },
      });
      if (!department) {
        throw new NotFoundException('academics.departments.NOT_FOUND');
      }

      return this.formatResponse(department);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('academics.departments.FETCH_FAILED');
    }
  }

// ===========================================================
  // Update Department
  // ===========================================================
  async update(id: number, updateDto: UpdateDepartmentDto) {
    try {
      const existingDepartment = await this.prisma.departmentProgram.findUnique(
        {
          where: { id },
          include: {
            faculty: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      );
      if (!existingDepartment) {
        throw new NotFoundException('academics.departments.NOT_FOUND');
      }

      if (
        updateDto.faculty_id &&
        updateDto.faculty_id !== existingDepartment.faculty_id
      ) {
        const faculty = await this.prisma.faculty.findUnique({
          where: { id: updateDto.faculty_id },
        });
        if (!faculty) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              faculty_id: [this.il8n.translate('academics.departments.FACULTY_NOT_FOUND')],
            },
          });
        }
      }

      if (updateDto.name !== existingDepartment.name) {
        const duplicateName = await this.prisma.departmentProgram.findFirst({
          where: {
            name: updateDto.name,
            faculty_id: updateDto.faculty_id || existingDepartment.faculty_id,
            id: { not: id },
          },
        });
        if (duplicateName) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              name: [this.il8n.translate('academics.departments.ALREADY_EXISTS')],
            },
          });
        }
      }

      const updatedDepartment = await this.prisma.departmentProgram.update({
        where: { id },
        data: {
          name: updateDto.name,
          faculty_id: updateDto.faculty_id,
          is_visible: updateDto.is_visible,
        },
        include: {
          faculty: {
            select: {
              id: true,
              name: true,
              university: true,
            },
          },
        },
      });

      return this.formatResponse(updatedDepartment);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('academics.departments.UPDATE_FAILED');
    }
  }

  // ===========================================================
  // Delete Department
  // ===========================================================
  async remove(id: number) {
    try {
      const department = await this.prisma.departmentProgram.findUnique({
        where: { id },
        include: {
          students: true,
        },
      });
      if (!department) {
        throw new NotFoundException('academics.departments.NOT_FOUND');
      }

      if (department.students && department.students.length > 0) {
        throw new ConflictException('academics.departments.HAS_LINKED_RECORDS');
      }

      await this.prisma.departmentProgram.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('academics.departments.DELETE_FAILED');
    }
  }
}