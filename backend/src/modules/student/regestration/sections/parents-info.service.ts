import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PeriodGuardHelper } from '../helpers/period.guard.helper';
import { ResponseHelper } from 'src/response-helper/response-helper';
import { ParentsInfoDto } from '../dto';

@Injectable()
export class ParentsInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly periodGuard: PeriodGuardHelper,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async save(dto: ParentsInfoDto, userId: number, lang: string) {
    const student = await this.findStudent(userId);
    await this.periodGuard.guardStudent(student);

    if (!student.isEgyptian)
      throw new BadRequestException('student.STUDENT_NOT_EGYPTIAN');

    await this.prisma.student.update({
      where: { userId },
      data: {
        parentsStatus: dto.parents_status,
        parentsOutsideEgypt: dto.family_residency_abroad,
      },
    });

    return this.responseHelper.success(
      { id: student.id },
      'student.PARENTS_INFO_SUCCESS',
      lang,
    );
  }

  private async findStudent(userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: { id: true, isEgyptian: true, applied_at: true},
    });

    if (!student) throw new NotFoundException('common.USER_NOT_FOUND');
    return student;
  }
}