import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OnModuleInit } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FaceRecognitionService implements OnModuleInit {
  private readonly logger = new Logger(FaceRecognitionService.name);
  private readonly pythonUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.pythonUrl = this.configService.get<string>('PYTHON_SERVICE_URL');
  }

  // =============================================================
  // On Boot — Hydrate Python Redis Cache
  // =============================================================
  async onModuleInit() {
    try {
      await this.hydrateMemory();
    } catch {
      this.logger.warn('Python service unavailable on boot. Hydration skipped.');
    }
  }

  // =============================================================
  // Hydrate Memory
  // =============================================================
  async hydrateMemory() {
    const embeddings = await this.prisma.faceEmbedding.findMany({
      include: {
        student: {
          select: { fullName: true },
        },
      },
    });

    if (embeddings.length === 0) {
      this.logger.log('No face embeddings found. Hydration skipped.');
      return { students_loaded: 0, already_logged: 0 };
    }

    const payload = {
      students: embeddings.map((e) => ({
        student_id: e.student_id,
        full_name:  e.student.fullName ?? null,
        embedding:  JSON.parse(e.embedding) as number[],
      })),
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.pythonUrl}/hydrate-memory`, payload),
    );

    const { students_loaded, already_logged } = response.data;

    this.logger.log(
      `Hydration complete — ${students_loaded} students loaded, ${already_logged} already logged today.`,
    );

    return { students_loaded, already_logged };
  }

  // =============================================================
  // Unenroll Student
  // Called by Residency module on checkout / term end
  // =============================================================
  async unenrollStudent(studentId: number) {
    try {
      const embedding = await this.prisma.faceEmbedding.findUnique({
        where: { student_id: studentId },
      });

      if (!embedding) {
        throw new NotFoundException('attendance.face_recognition.STUDENT_NOT_ENROLLED');
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.pythonUrl}/unenroll-student`, {
          student_id: studentId,
        }),
      );

      return response.data; // { student_id, removed_from_db, removed_from_cache }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Failed to unenroll student ${studentId}`, error);
      throw new InternalServerErrorException('attendance.face_recognition.UNENROLL_FAILED');
    }
  }

  // =============================================================
  // Reset System
  // Full wipe — Python truncates face_embeddings + attendance_logs + clears Redis
  // =============================================================
  async resetSystem() {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.pythonUrl}/reset-system`, {}),
      );

      const result = response.data;
      // { embeddings_cleared, logs_cleared, cache_cleared, embeddings_deleted, logs_deleted }

      this.logger.log(
        `System reset complete — ${result.embeddings_deleted} embeddings deleted, ${result.logs_deleted} logs deleted.`,
      );

      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('System reset failed', error);
      throw new InternalServerErrorException('attendance.face_recognition.RESET_FAILED');
    }
  }
}