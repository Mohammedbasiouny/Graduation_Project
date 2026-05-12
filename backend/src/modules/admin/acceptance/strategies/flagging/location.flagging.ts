import { BaseFlaggingStrategy, StudentRankedDto } from './base-flagging.strategy';

export class LocationFlaggingStrategy extends BaseFlaggingStrategy {
  getName(): string {
    return 'Geographic Acceptance';
  }

  apply(student: StudentRankedDto): void {

    // 1. Check Residency (Applies to all students)
    if (!student.policeDepartment) {
      this.review(student, 'flags.city_missing'); 
    } else if (student.policeDepartment.acceptance_status === false) {
      this.reject(student, 'flags.city_suspended'); // "عدم مطابقة النطاق الجغرافي"
    }

    // 2. Check High School Location (Applies to NEW students only)
    if (student.is_new) {
      if (!student.educationalDepartment) {
        this.review(student, 'flags.data_missing');
      } else if (student.educationalDepartment.acceptance_status === false) {
        this.reject(student, 'flags.city_suspended'); 
      }
    }
  }
}