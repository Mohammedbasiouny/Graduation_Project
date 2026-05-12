import { BaseRankingStrategy } from './base-ranking.strategy';
import { StudentRankedDto } from '../flagging/base-flagging.strategy';

export class NewStudentRankingStrategy extends BaseRankingStrategy {
  getName(): string {
    return 'New Student Ranking';
  }

  rank(students: StudentRankedDto[]): StudentRankedDto[] {
    const sortedStudents = [...students].sort((a, b) => {
      const gradeA = this.getGradePercentage(a);
      const gradeB = this.getGradePercentage(b);
      if (gradeA !== gradeB) return gradeB - gradeA;

      const dobA = a.dateOfBirth ? new Date(a.dateOfBirth).getTime() : 0;
      const dobB = b.dateOfBirth ? new Date(b.dateOfBirth).getTime() : 0;
      if (dobA !== dobB) return dobB - dobA;

      const distA = a.governorate?.distanceFromCairo ?? 0;
      const distB = b.governorate?.distanceFromCairo ?? 0;
      return distB - distA;
    });

    return this.assignPositions(sortedStudents).map((student) => ({
      ...student,
      _rankScore: this.getGradePercentage(student),
    }));
  }

  private getGradePercentage(student: StudentRankedDto): number {
    if (student.percentage != null) return student.percentage;
    if (student.highSchoolTotalGrade != null && student.qualification?.degree != null) {
      return (student.highSchoolTotalGrade / student.qualification.degree) * 100;
    }
    return 0; // missing grade — pushed to bottom, flagged by MissingGradeFlaggingStrategy
  }
}