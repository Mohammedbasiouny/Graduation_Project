import { BaseFlaggingStrategy, StudentRankedDto } from './base-flagging.strategy';

export class MedicalCheckFlaggingStrategy extends BaseFlaggingStrategy {
  getName(): string {
    return 'Medical Check';
  }

  apply(student: StudentRankedDto): void {
    // ✅ Fixed: Access the 1-to-1 object directly
    const medicalReview = student.medicalReviews;

    // ✅ Updated Logic: If they have NO review, flag for revision.
    // If they have one, they pass (since manual doctor approval was removed).
    if (!medicalReview) {
      this.review(student, 'flags.medical_no_record'); 
      return; 
    }
  }
}