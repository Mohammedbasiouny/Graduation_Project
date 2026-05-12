import { BaseFlaggingStrategy, StudentRankedDto } from './base-flagging.strategy';

export class FeeExpelledFlaggingStrategy extends BaseFlaggingStrategy {
  getName(): string {
    return 'Fee Expelled';
  }

  apply(student: StudentRankedDto): void {
    if (student.feeExpelled === true) {
      this.reject(student, 'flags.fee_expelled');
    } else if (student.feeExpelled === null || student.feeExpelled === undefined) {
      this.review(student, 'flags.fee_expelled_missing');
    }
  }
}