import { BaseService } from "../Base.service";

export class ApplicationDatesAdminService extends BaseService {
  constructor() {
    super("/admin/application-dates");
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination } = params;

    return this.get("", {
      params: {
        page,
        page_size,
        with_pagination
      },
    });
  }

  findOne(id) {
    return this.get(`/${id}`);
  }

  getStatistics() {
    return this.get(`/statistics`);
  }

  create(data) {
    return this.post("", data);
  }

  update(id, data) {
    return this.put(`/${id}`, data);
  }

  remove(id) {
    return super.delete(`/${id}`);
  }

  truncate() {
    return super.delete("/truncate");
  }

  togglePeriodStatus() {
    return this.patch(`/period/toggle-status`);
  }

  togglePreliminaryResultAnnounced(id) {
    return this.patch(`/${id}/toggle-preliminary-result-announced`);
  }
}

