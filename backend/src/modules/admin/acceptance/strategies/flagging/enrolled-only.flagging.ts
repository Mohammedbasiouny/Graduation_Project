import { BaseFlaggingStrategy, StudentRankedDto } from './base-flagging.strategy';
import { ACCEPTANCE_CONSTANTS } from '../../constants/acceptance.constants';

export class EnrolledOnlyFlaggingStrategy extends BaseFlaggingStrategy {
  getName(): string {
    return 'Affiliated Enrollment';
  }

  apply(student: StudentRankedDto): void {
    if (student.enrollmentStatus === ACCEPTANCE_CONSTANTS.ENROLLMENT.AFFILIATED) {
      this.reject(student, 'flags.enrolled_only');
    }
  }
}