import { Injectable } from "@nestjs/common";

@Injectable()
export class StudentCompletionHelper {

    isFilled(value: any): boolean {
        return value !== null && value !== undefined && value !== '';
    }

    isCompleted(student: any): boolean {
        const qualificationValid = student.is_new === false || student.qualificationId !== null;
        const egyptianFieldsValid = this.assertEgyptianFields(student);
        const baseValid =
            student.is_new !== null &&
            student.is_inside_egypt !== null &&
            student.isEgyptian !== null &&
            student.residencyInfoCompleted === true &&
            student.academicInfoCompleted === true &&
            student.dormType !== null &&
            !!student.medicalReviews;

        return baseValid && qualificationValid && egyptianFieldsValid;
    }

    private assertEgyptianFields(student: any): boolean {
        if (student.isEgyptian === true) {
            return this.isFilled(student.parentsStatus) && this.isFilled(student.guardianNationalId);
        }
        if (student.isEgyptian === false) {
            return !this.isFilled(student.parentsStatus) && !this.isFilled(student.guardianNationalId);
        }
        return false;
    }
}