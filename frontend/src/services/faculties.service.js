import { BaseService } from "./Base.service";

class FacultiesService extends BaseService {
  constructor() {
    super("/admin/faculties");
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination, university } = params;

    return this.get("", {
      params: {
        page,
        page_size,
        with_pagination,
        university,
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

export const facultiesService = new FacultiesService();
