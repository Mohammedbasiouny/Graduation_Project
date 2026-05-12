import { BaseService } from "../Base.service";

export class AttendanceAdminService extends BaseService {
  constructor() {
    super("/admin/attendance");
  }

  studentCalendar(studentId, params = {}) {
    const { year, month } = params;

    return this.get(`student/${studentId}/calendar`, {
      params: {
        year,
        month,
      },
    });
  }
}

