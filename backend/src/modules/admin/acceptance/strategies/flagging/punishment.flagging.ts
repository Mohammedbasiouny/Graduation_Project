import { BaseFlaggingStrategy, StudentRankedDto } from './base-flagging.strategy';

export class PunishmentFlaggingStrategy extends BaseFlaggingStrategy {
  getName(): string {
    return 'Punishment';
  }

  apply(student: StudentRankedDto): void {
    if (student.hasPunishment === true) {
      this.reject(student, 'flags.punishment');
    } else if (student.hasPunishment === null || student.hasPunishment === undefined) {
      this.review(student, 'flags.punishment_missing');
    }
  }
}