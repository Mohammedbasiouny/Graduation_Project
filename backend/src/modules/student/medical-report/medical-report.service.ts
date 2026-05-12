import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicalReportDto } from './dto/index';

@Injectable()
export class MedicalReportService {
  constructor(private prisma: PrismaService) { }

  // =============================================================
  // Create or Update Medical Report (Student)
  // =============================================================
  async create(userId: number, dto: CreateMedicalReportDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('common.USER_NOT_FOUND');

      const student = await this.prisma.student.findUnique({ where: { userId } });
      if (!student) throw new NotFoundException('student.UPDATE_TARGET_NOT_FOUND');

      const data = {
        blood_pressure: dto.blood_pressure,
        blood_pressure_details: dto.blood_pressure_details || null,
        diabetes: dto.diabetes,
        diabetes_details: dto.diabetes_details || null,
        heart_disease: dto.heart_disease,
        heart_disease_details: dto.heart_disease_details || null,
        immune_diseases: dto.immune_diseases,
        immune_diseases_details: dto.immune_diseases_details || null,
        mental_health: dto.mental_health,
        mental_health_details: dto.mental_health_details || null,
        other_diseases: dto.other_diseases,
        other_diseases_details: dto.other_diseases_details || null,
        mental_health_treatment: dto.mental_health_treatment,
        mental_health_treatment_details: dto.mental_health_treatment_details || null,
        receiving_treatment: dto.receiving_treatment,
        receiving_treatment_details: dto.receiving_treatment_details || null,
        allergies: dto.allergies,
        allergies_details: dto.allergies_details || null,
        special_needs: dto.special_needs,
        special_needs_details: dto.special_needs_details || null,
        adapt_to_new_environments: dto.adapt_to_new_environments,
        prefer_solitude: dto.prefer_solitude,
        behavioral_problems: dto.behavioral_problems,
        suspension_history: dto.suspension_history,
        shared_room_adaptation: dto.shared_room_adaptation,
        social_support: dto.social_support,
        stimulants_or_sedatives: dto.stimulants_or_sedatives,
        social_media_usage: dto.social_media_usage,
        sadness_without_reason: dto.sadness_without_reason,
        anxiety_or_stress: dto.anxiety_or_stress,
        concentration_difficulty: dto.concentration_difficulty,
        sleep_problems: dto.sleep_problems,
        loss_of_interest: dto.loss_of_interest,
        self_harm_thoughts: dto.self_harm_thoughts,
        appetite_changes: dto.appetite_changes,
        anger_outbursts: dto.anger_outbursts,
      };

      const existingReport = await this.prisma.medicalReview.findUnique({
        where: { student_id: student.id },
      });

      let medicalReport;
      if (existingReport) {
        medicalReport = await this.prisma.medicalReview.update({
          where: { id: existingReport.id },
          data: { ...data, user_id: userId },
        });
      } else {
        medicalReport = await this.prisma.medicalReview.create({
          data: { student_id: student.id, user_id: userId, ...data },
        });
      }

      return medicalReport;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Create Medical Report Error:', error);
      throw new InternalServerErrorException('medical.CREATE_FAILED');
    }
  }

  // =============================================================
  // Find All Medical Reports
  // =============================================================
  async findAll() {
    try {
      return await this.prisma.medicalReview.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              nationalId: true,
            },
          },
          user: {
            select: {
              id: true,
              full_name: true,
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Find All Medical Reports Error:', error);
      throw new InternalServerErrorException('medical.FETCH_FAILED');
    }
  }

  // =============================================================
  // Find One Medical Report by ID
  // =============================================================
  async findOne(id: number) {
    try {
      const medicalReport = await this.prisma.medicalReview.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              nationalId: true,
              phoneNumber: true,
            },
          },
          user: {
            select: {
              id: true,
              full_name: true,
              role: true,
            },
          },
        },
      });

      if (!medicalReport) throw new NotFoundException('medical.NOT_FOUND');

      return medicalReport;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Find One Medical Report Error:', error);
      throw new InternalServerErrorException('medical.FETCH_FAILED');
    }
  }

  // =============================================================
  // Find Medical Report by Student ID
  // =============================================================
  async findByStudentId(studentId: number) {
    try {
      const medicalReport = await this.prisma.medicalReview.findUnique({
        where: { student_id: studentId },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              nationalId: true,
            },
          },
          user: {
            select: {
              id: true,
              full_name: true,
              role: true,
            },
          },
        },
      });

      if (!medicalReport) throw new NotFoundException('medical.NOT_FOUND');

      return medicalReport;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Find Medical Report by Student Error:', error);
      throw new InternalServerErrorException('medical.FETCH_FAILED');
    }
  }
}