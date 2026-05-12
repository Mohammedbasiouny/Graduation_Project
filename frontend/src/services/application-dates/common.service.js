import { BaseService } from "../Base.service";

export class ApplicationDatesCommonService extends BaseService {
  constructor() {
    super("/application-dates");
  }

  findAll() {
    return this.get("");
  }

  getPeriodStatus() {
    return this.get(`/period/status`);
  }

  getCurrentPeriod() {
    return this.get("/current-period");
  }
}

