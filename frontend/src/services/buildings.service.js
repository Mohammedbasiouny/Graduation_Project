import { BaseService } from "./Base.service";

class BuildingsService extends BaseService {
  constructor() {
    super("/admin/buildings");
  }

  findAll(params = {}) {
    const { type, available, page, page_size, with_pagination } = params;

    return this.get("", {
      params: {
        type,
        available,
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

export const buildingsService = new BuildingsService();
