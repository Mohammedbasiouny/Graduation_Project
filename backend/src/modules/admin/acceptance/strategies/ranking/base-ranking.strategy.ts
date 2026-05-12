import { StudentRankedDto } from './../flagging/base-flagging.strategy';

export interface RankingStrategy {
  getName(): string;
  rank(students: StudentRankedDto[]): StudentRankedDto[];
}

export abstract class BaseRankingStrategy implements RankingStrategy {
  abstract getName(): string;
  abstract rank(students: StudentRankedDto[]): StudentRankedDto[];

  protected assignPositions(students: StudentRankedDto[]): StudentRankedDto[] {
    return students.map((student, index) => ({
      ...student,
      _rankPosition: index + 1,
    }));
  }
}