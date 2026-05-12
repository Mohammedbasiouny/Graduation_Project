import { BaseFlaggingStrategy, StudentRankedDto } from './base-flagging.strategy';

export class MissingGradeFlaggingStrategy extends BaseFlaggingStrategy {
  getName(): string {
    return 'Missing Grade';
  }

  apply(student: StudentRankedDto): void {
    if (student.is_new === false) return; // only for new students

    const hasPercentage = student.percentage != null;
    const hasCalculable = student.highSchoolTotalGrade != null && student.qualification?.degree != null;

    if (!hasPercentage && !hasCalculable) {
      this.review(student, 'flags.missing_grade');
    }
  }
}