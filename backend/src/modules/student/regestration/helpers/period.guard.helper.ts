import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PeriodGuardHelper {
  constructor(private readonly prisma: PrismaService) {}

  async assertPeriodOpen(): Promise<void> {
    const settings = await this.prisma.settings.findFirst({
      select: { application_period_open: true },
    });
    if (!settings?.application_period_open) {
      throw new BadRequestException('student.REGISTRATION_PERIOD_NOT_ACTIVE');
    }
  }

  async assertWithinApplicationDate(studentAppliedAt: Date): Promise<void> {
    const period = await this.prisma.applicationDate.findFirst({
      where: {
        startAt: { lte: studentAppliedAt },
        endAt:   { gte: studentAppliedAt },
      },
    });

    if (!period) {
      throw new BadRequestException('No valid application period found');
    }

    if (new Date() > period.endAt) {
      throw new BadRequestException('student.CANNOT_UPDATE_AFTER_PERIOD_END');
    }
  }

  async guardStudent(student: { applied_at: Date } | null): Promise<void> {
    if (!student) {
      return;
    } else {
      await this.assertPeriodOpen();
      if (!student?.applied_at) {
        return;
      }
      await this.assertWithinApplicationDate(student?.applied_at);
    }
  }
}