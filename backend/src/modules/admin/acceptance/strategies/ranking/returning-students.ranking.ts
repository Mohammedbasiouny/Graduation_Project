import { BaseRankingStrategy } from './base-ranking.strategy';
import { StudentRankedDto } from '../flagging/base-flagging.strategy';
import { ACCEPTANCE_CONSTANTS } from '../../constants/acceptance.constants';

export class ReturningStudentRankingStrategy extends BaseRankingStrategy {
  getName(): string {
    return 'Returning Student Ranking';
  }

  rank(students: StudentRankedDto[]): StudentRankedDto[] {
    const sortedStudents = [...students].sort((a, b) => {
      // Cast the constant to a Record so TypeScript doesn't complain about dynamic indexing
      const gradeScores = ACCEPTANCE_CONSTANTS.GRADE_SCORES as Record<string, number>;
      
      const scoreA = gradeScores[a.grade ?? ''] ?? 0;
      const scoreB = gradeScores[b.grade ?? ''] ?? 0;
      if (scoreA !== scoreB) return scoreB - scoreA;

      const dobA = a.dateOfBirth ? new Date(a.dateOfBirth).getTime() : 0;
      const dobB = b.dateOfBirth ? new Date(b.dateOfBirth).getTime() : 0;
      if (dobA !== dobB) return dobB - dobA;

      const distA = a.governorate?.distanceFromCairo ?? 0;
      const distB = b.governorate?.distanceFromCairo ?? 0;
      return distB - distA;
    });

    return this.assignPositions(sortedStudents).map((student) => {
      const gradeScores = ACCEPTANCE_CONSTANTS.GRADE_SCORES as Record<string, number>;
      return {
        ...student,
        _rankScore: gradeScores[student.grade ?? ''] ?? 0,
      };
    });
  }
}