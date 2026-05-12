import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResidentsService {
  constructor(private readonly prisma: PrismaService) {}

  // =============================================================
  // Create Resident From Enrollment
  // =============================================================
  async createFromEnrollment(studentId: number) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('residents.STUDENT_NOT_FOUND');
      }

      const application = await this.prisma.studentApplication.findFirst({
        where: {
          studentId:       studentId,
          finalAcceptance: 'accepted',
          candidateForFinalAcceptance: 'accepted',
          securityReviewStatus: true
        },
      });

      if (!application) {
        throw new UnprocessableEntityException({
          status:  'error',
          message: ['Validation failed.'],
          data:    null,
          errors:  {
            student_id: ['residents.NO_ACCEPTED_APPLICATION'],
          },
        });
      }

      const existing = await this.prisma.resident.findFirst({
        where: {
          student_id:     studentId,
          application_id: application.id,
        },
      });

      if (existing) {
        return existing;
      }

      const resident = await this.prisma.resident.create({
        data: {
          student_id:     studentId,
          application_id: application.id,
        },
      });

      return resident;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('residents.CREATE_FAILED');
    }
  }
}