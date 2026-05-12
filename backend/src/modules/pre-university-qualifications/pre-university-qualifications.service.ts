import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePreUniversityQualificationDto, UpdatePreUniversityQualificationDto } from './dto/index';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PreUniversityQualificationsService {
  constructor(
    private prisma: PrismaService,
    private il8n: I18nService,
  ) { }

  private formatResponse(qualification: any) {
    return {
      id: qualification.id,
      name: qualification.name,
      is_visible: qualification.is_visible,
      degree: qualification.degree,
      notes: qualification.notes,
    };
  }

  // =============================================================
  // Create Qualification
  // =============================================================
  async create(createDto: CreatePreUniversityQualificationDto) {
    try {
      const existingQualification = await this.prisma.preUniversityQualification.findFirst({
        where: {
          name: createDto.name,
        },
      });
      if (existingQualification) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: [this.il8n.translate('pre-university-qualifications.ALREADY_EXISTS')],
          },
        });
      }

      const qualification = await this.prisma.preUniversityQualification.create({
        data: {
          name: createDto.name,
          is_visible: createDto.is_visible,
          degree: createDto.degree,
          notes: createDto.notes || null,
        },
      });
      return this.formatResponse(qualification);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('pre-university-qualifications.CREATE_FAILED');
    }
  }

  // ============================================================
  // Get Qualifications
  // ============================================================
  async findAll(
    page: number = 1,
    pageSize: number = 20,
    withPagination: boolean = true,
  ) {
    try {
      // ================= WITHOUT PAGINATION =================
      if (!withPagination) {
        const items = await this.prisma.preUniversityQualification.findMany({
          orderBy: {
            created_at: 'asc',
          },
        });

        return {
          data: items.map((q) => this.formatResponse(q)),
          meta: {
            pagination: {
              page: 1,
              page_size: items.length,
              total_pages: 1,
              total_items: items.length,
            },
            search: null,
            filters: null,
            sorting: null,
          },
        };
      }

      // ================= WITH PAGINATION =================
    
      const skip = (page - 1) * pageSize;

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.preUniversityQualification.findMany({
          skip,
          take: pageSize,
          orderBy: {
            created_at: 'asc',
          },
        }),

        this.prisma.preUniversityQualification.count(),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: items.map((q) => this.formatResponse(q)),
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
      console.error('Error fetching pre-university qualifications:', error);
      throw new InternalServerErrorException(
        'pre-university-qualifications.FETCH_FAILED',
      );
    }
  }


  // ===========================================================
  // Get Qualification by ID
  // ===========================================================
  async findOne(id: number) {
    try {
      const qualification = await this.prisma.preUniversityQualification.findUnique({
        where: { id },
      });
      if (!qualification) {
        throw new NotFoundException('pre-university-qualifications.NOT_FOUND');
      }

      return this.formatResponse(qualification);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('pre-university-qualifications.FETCH_FAILED');
    }
  }

  // ===========================================================
  // Update Qualification
  // ==========================================================
  async update(id: number, updateDto: UpdatePreUniversityQualificationDto) {
    try {
      const existingQualification = await this.prisma.preUniversityQualification.findUnique({
        where: { id },
      });
      if (!existingQualification) {
        throw new NotFoundException('pre-university-qualifications.NOT_FOUND');
      }

      if (updateDto.name !== existingQualification.name) {
        const duplicateName = await this.prisma.preUniversityQualification.findFirst({
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
              name: [this.il8n.translate('pre-university-qualifications.ALREADY_EXISTS')],
            },
          });
        }
      }

      const updatedQualification = await this.prisma.preUniversityQualification.update({
        where: { id },
        data: {
          name: updateDto.name,
          is_visible: updateDto.is_visible,
          degree: updateDto.degree,
          notes: updateDto.notes || null,
        },
      });
      return this.formatResponse(updatedQualification);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('pre-university-qualifications.UPDATE_FAILED');
    }
  }

  // ===========================================================
  // Delete Qualification
  // ===========================================================
  async remove(id: number) {
    try {
      const qualification = await this.prisma.preUniversityQualification.findUnique({
        where: { id },
        include: {
          students: true,
        },
      });
      if (!qualification) {
        throw new NotFoundException('pre-university-qualifications.NOT_FOUND');
      }

      if (qualification.students && qualification.students.length > 0) {
        throw new ConflictException('pre-university-qualifications.HAS_LINKED_RECORDS');
      }

      await this.prisma.preUniversityQualification.delete({
        where: { id },
      });

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('pre-university-qualifications.DELETE_FAILED');
    }
  }
}
