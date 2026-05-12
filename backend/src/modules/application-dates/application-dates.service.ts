import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { CreateApplicationDateDto, UpdateApplicationDateDto } from './dto';
import { StudentType } from '@prisma/client';

@Injectable()
export class ApplicationDatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  // ================= HELPER METHODS =================
  private isFilled(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  public isCompletedStudent(student: any): boolean {
    const qualificationValid =
      student.is_new === false || student.qualificationId !== null;

    let egyptianFieldsValid = false;
    if (student.isEgyptian === true) {
      egyptianFieldsValid =
        this.isFilled(student.parentsStatus) &&
        this.isFilled(student.guardianNationalId);
    } else if (student.isEgyptian === false) {
      egyptianFieldsValid =
        !this.isFilled(student.parentsStatus) &&
        !this.isFilled(student.guardianNationalId);
    }

    const baseValid =
      student.is_new !== null &&
      student.is_inside_egypt !== null &&
      student.isEgyptian !== null &&
      student.residencyInfoCompleted === true &&
      student.academicInfoCompleted === true &&
      student.dormType !== null &&
      !!student.medicalReviews; // ✅ FIXED: Removed _count?.

    return baseValid && qualificationValid && egyptianFieldsValid;
  }

  // ================= GET STATISTICS =================
  async getStatistics(lang: string) {
    try {
      // 1. Fetch phases and ONLY include the applications needed for security/candidacy stats
      const phases = await this.prisma.applicationDate.findMany({
        include: {
          studentApplications: {
            select: {
              securityReviewStatus: true,
              candidateForFinalAcceptance: true,
            },
          },
        },
        orderBy: { startAt: 'asc' },
      });

      // 2. Map through phases and fetch students concurrently
      const stats = await Promise.all(
        phases.map(async (phase) => {
          // Fetch students created within this phase's date range
          const students = await this.prisma.student.findMany({
            where: {
              // Note: Adjust to applied_at if your Prisma schema doesn't map it to camelCase
              applied_at: {
                gte: phase.startAt,
                lte: phase.endAt,
              },
            },
            include: {
              medicalReviews: { select: { id: true } }, // ✅ FIXED: Replaced _count with direct selection
            },
          });

          // Initialize counters
          let completed_male = 0;
          let completed_female = 0;
          let security_accepted = 0;
          let candidates_for_final_acceptanced = 0;

          let new_total_eg = 0;
          let new_completed_eg = 0;
          let old_total_eg = 0;
          let old_completed_eg = 0;

          let new_total_ex = 0;
          let new_completed_ex = 0;
          let old_total_ex = 0;
          let old_completed_ex = 0;

          // 'applications' is now the total count of students registered in this time window
          const applications = students.length;

          // Calculate Student Demographics & Completion Status
          students.forEach((student) => {
            const isCompleted = this.isCompletedStudent(student);
            const isEg = student.isEgyptian === true;
            const isNew = student.is_new === true;

            // Gender Stats
            if (isCompleted) {
              if (student.gender === 'male') completed_male++;
              if (student.gender === 'female') completed_female++;
            }

            // Demographics Stats
            if (isNew && isEg) {
              new_total_eg++;
              if (isCompleted) new_completed_eg++;
            } else if (!isNew && isEg) {
              old_total_eg++;
              if (isCompleted) old_completed_eg++;
            } else if (isNew && !isEg) {
              new_total_ex++;
              if (isCompleted) new_completed_ex++;
            } else if (!isNew && !isEg) {
              old_total_ex++;
              if (isCompleted) old_completed_ex++;
            }
          });

          // Calculate Application-Specific Stats
          // Defaults to 0 if the phase has no applications yet
          phase.studentApplications.forEach((app) => {
            if (app.securityReviewStatus === true) {
              security_accepted++;
            }
            if (app.candidateForFinalAcceptance === 'accepted') {
              candidates_for_final_acceptanced++;
            }
          });

          return {
            id: phase.id,
            name: phase.name,
            studentType: phase.studentType.toLowerCase(),
            startAt: phase.startAt,
            endAt: phase.endAt,
            preliminaryResultAnnounced: phase.preliminaryResultAnnounced,
            applications,
            completed_male,
            completed_female,
            security_accepted,
            candidates_for_final_acceptanced,
            new_total_eg,
            new_completed_eg,
            old_total_eg,
            old_completed_eg,
            new_total_ex,
            new_completed_ex,
            old_total_ex,
            old_completed_ex,
          };
        }),
      );

      return this.responseHelper.success(
        stats,
        'application_dates.STATISTICS_RETRIEVED',
        lang,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.STATISTICS_FETCH_FAILED',
      );
    }
  }

  // ================= CREATE =================
  async create(dto: CreateApplicationDateDto, lang: string) {
    try {
      const studentTypeEnum = {
        new: StudentType.new,
        old: StudentType.old,
        all: StudentType.all,
      };
      const studentTypeValue = studentTypeEnum[dto.studentType?.toLowerCase()] ?? null;

      const dtoStart = new Date(dto.startAt);
      const dtoEnd = new Date(dto.endAt);

      const existingPeriods = await this.prisma.applicationDate.findMany();

      for (const period of existingPeriods) {
        const periodStart = new Date(period.startAt);
        const periodEnd = new Date(period.endAt);

        const isOverlapping =
          dtoStart <= periodEnd && periodStart <= dtoEnd;

        if (isOverlapping) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              startAt: ['Period overlaps with existing application date'],
              endAt: ['Period overlaps with existing application date'],
            },
          });
        }
      }

      const app = await this.prisma.applicationDate.create({
        data: {
          ...dto,
          studentType: studentTypeValue,
          startAt: dtoStart,
          endAt: dtoEnd,
        },
      });

      return this.responseHelper.success(
        app,
        'application_dates.CREATED',
        lang,
      );
    } catch (error: any) {
      console.error(error);

      if (error instanceof UnprocessableEntityException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'application_dates.CREATE_FAILED',
      );
    }
  }

  // ================= GET ALL =================
  async findAll(options: {
    lang: string;
    page: number;
    pageSize: number;
    withPagination: boolean;
  }) {
    try {
      const { lang, page, pageSize, withPagination } = options;

      // ── WITHOUT PAGINATION ───────────────────────────────────
      if (!withPagination) {
        const items = await this.prisma.applicationDate.findMany({
          orderBy: { startAt: 'asc' }, // Assuming created_at field exists
        });

        return this.responseHelper.success(
          items,
          'application_dates.LIST',
          lang,
          {
            pagination: {
              page: 1,
              page_size: items.length,
              total_pages: 1,
              total_items: items.length,
            },
            filters: null,
            search: null,
            sorting: null,
          },
        );
      }

      // ── WITH PAGINATION ──────────────────────────────────────
      const skip = (page - 1) * pageSize;

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.applicationDate.findMany({
          skip,
          take: pageSize,
          orderBy: { startAt: 'asc' }, // Assuming created_at field exists
        }),
        this.prisma.applicationDate.count(),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return this.responseHelper.success(
        items,
        'application_dates.LIST',
        lang,
        {
          pagination: {
            page,
            page_size: pageSize,
            total_pages: totalPages,
            total_items: totalItems,
          },
          filters: null,
          search: null,
          sorting: null,
        },
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('application_dates.LIST_FAILED');
    }
  }

  // ================= GET ONE =================
  async findOne(id: number, lang: string) {
    try {
      const app = await this.prisma.applicationDate.findUnique({
        where: { id },
      });

      if (!app) {
        throw new NotFoundException(
          'application_dates.NOT_FOUND',
        );
      }

      return this.responseHelper.success(
        app,
        'application_dates.SINGLE',
        lang,
      );

    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;

      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.FETCH_FAILED',
      );
    }
  }

  // ================= UPDATE =================
  async update(
    id: number,
    dto: UpdateApplicationDateDto,
    lang: string,
  ) {
    try {
      const studentTypeEnum = {
        new: StudentType.new,
        old: StudentType.old,
        all: StudentType.all,
      };

      const studentTypeValue =
        dto.studentType !== undefined
          ? studentTypeEnum[dto.studentType.toLowerCase()]
          : undefined;

      const current = await this.prisma.applicationDate.findUnique({
        where: { id },
      });

      if (!current) {
        throw new NotFoundException(
          'application_dates.UPDATE_TARGET_NOT_FOUND',
        );
      }

      const now = new Date();
      const startAtDate = new Date(current.startAt);
      const endAtDate = new Date(current.endAt);

      const periodStarted = now >= startAtDate;
      const periodEnded = now > endAtDate;

      if (periodEnded) {
        throw new UnprocessableEntityException({
          status: 'error',
          message: ['Validation failed.'],
          data: null,
          errors: {
            name: ['Cannot update a finished period'],
          },
        });
      }

      if (periodStarted) {
        const hasOtherFields =
          dto.name !== undefined ||
          dto.startAt !== undefined ||
          dto.university !== undefined ||
          dto.studentType !== undefined;

        if (hasOtherFields) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              name: [
                'Only endAt can be updated after the period has started',
              ],
            },
          });
        }
      }

      const startAt = dto.startAt
        ? new Date(dto.startAt)
        : current.startAt;

      const endAt = dto.endAt
        ? new Date(dto.endAt)
        : current.endAt;

      const existingPeriods = await this.prisma.applicationDate.findMany({
        where: {
          id: { not: id },
        },
      });

      for (const period of existingPeriods) {
        const periodStart = new Date(period.startAt);
        const periodEnd = new Date(period.endAt);

        const isOverlapping =
          startAt <= periodEnd && periodStart <= endAt;

        if (isOverlapping) {
          throw new UnprocessableEntityException({
            status: 'error',
            message: ['Validation failed.'],
            data: null,
            errors: {
              startAt: ['Period overlaps with existing application date'],
              endAt: ['Period overlaps with existing application date'],
            },
          });
        }
      }

      const app = await this.prisma.applicationDate.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.university !== undefined && {
            university: dto.university,
          }),
          ...(dto.studentType !== undefined && {
            studentType: studentTypeValue,
          }),
          ...(dto.startAt && { startAt }),
          ...(dto.endAt && { endAt }),
        },
      });

      return this.responseHelper.success(
        app,
        'application_dates.UPDATED',
        lang,
      );
    } catch (error: any) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }

      if (error.code === 'P2025') {
        throw new NotFoundException(
          'application_dates.UPDATE_TARGET_NOT_FOUND',
        );
      }

      throw new InternalServerErrorException(
        'application_dates.UPDATE_FAILED',
      );
    }
  }

  // ================= DELETE =================
  async delete(id: number, lang: string) {
    try {
      await this.prisma.applicationDate.delete({
        where: { id },
      });

      return this.responseHelper.success(
        null,
        'application_dates.DELETED',
        lang,
      );
    } catch (error: any) {
      console.error(error);

      if (error.code === 'P2025') {
        throw new NotFoundException(
          'application_dates.DELETE_TARGET_NOT_FOUND',
        );
      }

      throw new InternalServerErrorException(
        'application_dates.DELETE_FAILED',
      );
    }
  }

  // ================= GET STATUS =================
  async getStatus(lang: string) {
    try {
      const period = await this.prisma.settings.findFirst({
        select: {
          application_period_open: true,
          application_period_open_changed_at: true,
        },
      });

      if (!period) {
        return this.responseHelper.success(
          {
            period: {
              status: false,
              updated_at: null,
            },
          },
          'application_dates.STATUS_RETRIEVED',
          lang,
        );
      }

      return this.responseHelper.success(
        {
          period: {
            status: period.application_period_open,
            updated_at: period.application_period_open_changed_at,
          },
        },
        'application_dates.STATUS_RETRIEVED',
        lang,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.STATUS_FETCH_FAILED',
      );
    }
  }

  async toggleStatus(lang: string) {
    try {
      // Fetch current status
      const existing = await this.prisma.settings.findFirst({
        select: {
          id: true,
          application_period_open: true,
          application_period_open_changed_at: true,
        },
      });

      if (!existing) {
        throw new NotFoundException('application_dates.NOT_FOUND');
      }

      // Toggle the status
      const newStatus = !existing.application_period_open;

      const updated = await this.prisma.settings.update({
        where: { id: existing.id },
        data: {
          application_period_open: newStatus,
          application_period_open_changed_at: new Date(),
        },
      });

      return this.responseHelper.success(
        {
          status: updated.application_period_open,
        },
        'application_dates.STATUS_TOGGLED',
        lang,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.STATUS_TOGGLE_FAILED',
      );
    }
  }

  // ================= TOGGLE PRELIMINARY RESULT =================
  async togglePreliminaryResultAnnounced(id: number, lang: string) {
    try {
      const applicationDate = await this.prisma.applicationDate.findUnique({
        where: { id },
        select: {
          id: true,
          preliminaryResultAnnounced: true,
        },
      });

      if (!applicationDate) {
        throw new NotFoundException('application_dates.NOT_FOUND');
      }

      const newStatus = !applicationDate.preliminaryResultAnnounced;

      const updated = await this.prisma.applicationDate.update({
        where: { id },
        data: {
          preliminaryResultAnnounced: newStatus,
        },
      });

      return this.responseHelper.success(
        {
          id: updated.id,
          preliminaryResultAnnounced: updated.preliminaryResultAnnounced,
        },
        'application_dates.PRELIMINARY_RESULT_STATUS_TOGGLED',
        lang,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      
      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.PRELIMINARY_RESULT_TOGGLE_FAILED',
      );
    }
  }

  // =================Truncate table===========================
  async truncateTable(lang: string) {
    try {
      await this.prisma.applicationDate.deleteMany({});
      return this.responseHelper.success(
        null,
        'application_dates.TABLE_TRUNCATED',
        lang,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.TABLE_TRUNCATE_FAILED',
      );
    }
  }

  // ================= GET STUDENT APPLICATION DATES =================
  async findStudentApplicationDates(
    lang: string,
    studentId?: number,
  ) {
    try {
      // if no student id → return all
      if (!studentId) {
        const applicationDates =
          await this.prisma.applicationDate.findMany();

        return this.responseHelper.success(
          applicationDates,
          'application_dates.STUDENT_DATES_RETRIEVED',
          lang,
        );
      }

      // get student
      const student = await this.prisma.user.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('student.NOT_FOUND');
      }

      if (!student.university) {
        throw new NotFoundException(
          'student.UNIVERSITY_NOT_SET',
        );
      }

      // filter by university
      const applicationDates =
        await this.prisma.applicationDate.findMany({
          where: {
            OR: [
              { university: student.university },
              { university: 'all' },
            ],
          },
        });

      return this.responseHelper.success(
        applicationDates,
        'application_dates.STUDENT_DATES_RETRIEVED',
        lang,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.STUDENT_DATES_FETCH_FAILED',
      );
    }
  }

  // ================= GET CURRENT OPENED PERIOD =================
  async getCurrentOpenedPeriod(
    lang: string,
    studentId?: number,
  ) {
    try {
      const period = await this.prisma.settings.findFirst({
        select: {
          application_period_open: true,
          application_period_open_changed_at: true,
        },
      });

      if (!period) {
        return this.responseHelper.success(
          null,
          'application_dates.CURRENT_PERIOD_RETRIEVED',
          lang,
        );
      }
      if (!period?.application_period_open) {
        return this.responseHelper.success(
          null,
          'application_dates.CURRENT_PERIOD_RETRIEVED',
          lang,
        );
      }

      const now = new Date();

      let universityFilter: any = {};

      // if student provided -> filter by university
      if (studentId) {
        const student = await this.prisma.user.findUnique({
          select: {
            university: true,
          },
          where: { id: studentId },
        });

        if (!student) {
          return this.responseHelper.success(
            null,
            'application_dates.CURRENT_PERIOD_RETRIEVED',
            lang,
          );
        }

        if (!student.university) {
          return this.responseHelper.success(
            null,
            'application_dates.CURRENT_PERIOD_RETRIEVED',
            lang,
          );
        }

        universityFilter = {
          OR: [
            { university: student.university },
            { university: 'all' },
          ],
        };
      }

      const applicationPeriod = await this.prisma.applicationDate.findFirst({
        where: {
          ...universityFilter,
          startAt: {
            lte: now,
          },
          endAt: {
            gte: now,
          },
        },
        orderBy: {
          startAt: 'asc',
        },
      });

      return this.responseHelper.success(
        applicationPeriod,
        'application_dates.CURRENT_PERIOD_RETRIEVED',
        lang,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error(error);
      throw new InternalServerErrorException(
        'application_dates.CURRENT_PERIOD_FETCH_FAILED',
      );
    }
  }
}