import { BaseService } from "../Base.service";

export class AttendanceStudentService extends BaseService {
  constructor() {
    super("/student/attendance");
  }

  studentCalendar(params = {}) {
    const { year, month } = params;

    return this.get(`calendar`, {
      params: {
        year,
        month,
      },
    });
  }
}

