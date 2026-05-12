import { BaseService } from "../Base.service";

export class ApplicationDatesStudentService extends BaseService {
  constructor() {
    super("/student/application-dates");
  }

  findAll() {
    return this.get("");
  }

  getCurrentPeriod() {
    return this.get("/current-period");
  }
}
