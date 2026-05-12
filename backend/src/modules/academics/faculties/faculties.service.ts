import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacultyDto, UpdateFacultyDto } from './dto/index';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class FacultiesService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) {}

  private formatResponse(faculty: any, departmentCount?: number) {
    return {
      id: faculty.id,
      name: faculty.name,
      university: faculty.university,
      is_visible: faculty.is_visible,
      is_off_campus: faculty.is_off_campus,
      departments_count: departmentCount ?? 0,
    };
  }

  // =============================================================
  // Create Faculty
  // =============================================================
  async create(createDto: CreateFacultyDto) {
    try {
      const existingFaculty = await this.prisma.faculty.findFirst({
        where: {
          university: createDto.university,
          name: createDto.name,
        },
      });
      if (existingFaculty) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [this.il8n.translate('academics.faculties.ALREADY_EXISTS')],
          },
        });
      }

      const faculty = await this.prisma.faculty.create({
        data: {
          name: createDto.name,
          university: createDto.university,
          is_visible: createDto.is_visible,
          is_off_campus: createDto.is_off_campus,
        },
      });
      return this.formatResponse(faculty);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('academics.faculties.CREATE_FAILED');
    }
  }

  // ============================================================
  // Get All Faculties (WITH PAGINATION)
  // ============================================================
  // UPDATE findAll() - Get count for each faculty
  async findAll(options: {
    university?: 'hu' | 'hnu' | 'hitu' | 'all';
    page: number;
    pageSize: number;
    withPagination: boolean;
  }) {
    try {
      const {
        university = 'all',
        page,
        pageSize,
        withPagination,
      } = options;

      const allowedUniversities = ['hu', 'hnu', 'hitu'] as const;
      type AllowedUniversities = (typeof allowedUniversities)[number];

      const where: any = {};

      if (allowedUniversities.includes(university as AllowedUniversities)) {
        where.university = university;
      }

      // helper to attach department count
      const attachDepartmentCount = async (faculties) => {
        const counts = await this.prisma.departmentProgram.groupBy({
          by: ['faculty_id'],
          _count: { faculty_id: true },
        });

        const countMap = new Map(
          counts.map((c) => [c.faculty_id, c._count.faculty_id]),
        );

        return faculties.map((faculty) =>
          this.formatResponse(
            faculty,
            countMap.get(faculty.id) ?? 0,
          ),
        );
      };

      // ── WITHOUT PAGINATION ───────────────────────────────────
      if (!withPagination) {
        const items = await this.prisma.faculty.findMany({
          where,
          orderBy: { created_at: 'asc' },
        });

        const facultiesWithCount = await attachDepartmentCount(items);

        return {
          data: facultiesWithCount,
          meta: {
            pagination: {
              page: 1,
              page_size: items.length,
              total_pages: 1,
              total_items: items.length,
            },
            filters: [
              { key: 'university', value: university ?? 'all' },
            ],
            search: null,
            sorting: null,
          },
        };
      }

      // ── WITH PAGINATION ──────────────────────────────────────
      const skip = (page - 1) * pageSize;

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.faculty.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { created_at: 'asc' },
        }),
        this.prisma.faculty.count({ where }),
      ]);

      const facultiesWithCount = await attachDepartmentCount(items);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: facultiesWithCount,
        meta: {
          pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
            total_items: totalItems,
          },
          filters: [
            { key: 'university', value: university ?? 'all' },
          ],
          search: null,
          sorting: null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('Error fetching faculties:', error);
      throw new InternalServerErrorException(
        'academics.faculties.FETCH_FAILED',
      );
    }
  }

  // ===========================================================
  // Get Faculty by ID
  // ===========================================================
  async findOne(id: number) {
    try {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id },
      });
      if (!faculty) {
        throw new NotFoundException('academics.faculties.NOT_FOUND');
      }

      // Get department count
      const departmentCount = await this.prisma.departmentProgram.count({
        where: { faculty_id: id },
      });

      return this.formatResponse(faculty, departmentCount);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('academics.faculties.FETCH_FAILED');
    }
  }

  // ===========================================================
  // Update Faculty
  // ===========================================================
  async update(id: number, updateDto: UpdateFacultyDto) {
    try {
      const existingFaculty = await this.prisma.faculty.findUnique({
        where: { id },
      });
      if (!existingFaculty) {
        throw new NotFoundException('academics.faculties.NOT_FOUND');
      }

      if (updateDto.name !== existingFaculty.name) {
        const duplicateName = await this.prisma.faculty.findFirst({
          where: {
            name: updateDto.name,
            university: updateDto.university,
            id: { not: id },
          },
        });
        if (duplicateName) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              name: [this.il8n.translate('academics.faculties.ALREADY_EXISTS')],
            },
          });
        }
      }

      const updatedFaculty = await this.prisma.faculty.update({
        where: { id },
        data: {
          name: updateDto.name,
          university: updateDto.university,
          is_visible: updateDto.is_visible,
          is_off_campus: updateDto.is_off_campus,
        },
      });

      const departmentCount = await this.prisma.departmentProgram.count({
        where: { faculty_id: id },
      });

      return this.formatResponse(updatedFaculty, departmentCount);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('academics.faculties.UPDATE_FAILED');
    }
  }
  // ===========================================================
  // Delete Faculty
  // ===========================================================
  async remove(id: number) {
    try {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id },
        include: {
          departmentPrograms: true,
        },
      });
      if (!faculty) {
        throw new NotFoundException('academics.faculties.NOT_FOUND');
      }

      if (faculty.departmentPrograms && faculty.departmentPrograms.length > 0) {
        throw new ConflictException('academics.faculties.HAS_LINKED_RECORDS');
      }

      await this.prisma.faculty.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('academics.faculties.DELETE_FAILED');
    }
  }
}