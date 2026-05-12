import { Prisma } from '@prisma/client';

// ─── Prisma joined shape ───────────────────────────────────────────────────────
export const studentWithRelations = {
  governorate: true,
  policeDepartment: true,      
  city: true,
  educationalDepartment: true, 
  qualification: true,
  medicalReviews: true,
  faculty: true,
  highSchoolGovernorateRel: true,
  user: { select: { full_name: true } },
} satisfies Prisma.StudentInclude;

export type StudentWithRelations = Prisma.StudentGetPayload<{
  include: typeof studentWithRelations;
}>;

// ─── Pipeline type ─────────────────────────────────────────────────────────────
export type StudentRankedDto = StudentWithRelations & {
  applicationId: number;
  _flagReasons: string[];
  _systemRecommendation: 'accepted' | 'rejected' | 'review' | null;
  _rankPosition: number;
};

// ─── Flagging strategy interface ───────────────────────────────────────────────
export interface FlaggingStrategy {
  getName(): string;
  apply(student: StudentRankedDto): void;
}

export abstract class BaseFlaggingStrategy implements FlaggingStrategy {
  abstract getName(): string;
  abstract apply(student: StudentRankedDto): void;

  protected flag(student: StudentRankedDto, reason: string): void {
    student._flagReasons.push(reason);
  }

  protected reject(student: StudentRankedDto, reason: string): void {
    student._flagReasons.push(reason);
    student._systemRecommendation = 'rejected';
  }

  protected review(student: StudentRankedDto, reason: string): void {
    student._flagReasons.push(reason);
    if (student._systemRecommendation !== 'rejected') {
      student._systemRecommendation = 'review';
    }
  }
}