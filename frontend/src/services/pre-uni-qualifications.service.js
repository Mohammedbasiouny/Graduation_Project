import { BaseService } from "./Base.service";

class PerUniQualificationsService extends BaseService {
  constructor() {
    super("/admin/pre-university-qualifications");
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination } = params;

    return this.get("", {
      params: {
        page,
        page_size,
        with_pagination,
      },
    });
  }

  findOne(id) {
    return this.get(`/${id}`);
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
}

export const perUniQualificationsService = new PerUniQualificationsService();
