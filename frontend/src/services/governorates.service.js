import { BaseService } from "./Base.service";

class GovernoratesService extends BaseService {
  constructor() {
    super("/admin/governorates");
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

  getStatisticsAboutEgypt() {
    return this.get("statistics-about-egypt");
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

export const governoratesService = new GovernoratesService();
