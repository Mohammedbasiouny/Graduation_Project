import { BaseFlaggingStrategy, StudentRankedDto } from './base-flagging.strategy';

export class FailedSubjectsFlaggingStrategy extends BaseFlaggingStrategy {
  getName(): string {
    return 'Failed Subjects';
  }

  apply(student: StudentRankedDto): void {
    if (student.is_new) {
      return;
    }

    if (student.grade === 'راسب') {
      this.reject(student, 'flags.failed_subjects');
    }
  }
}