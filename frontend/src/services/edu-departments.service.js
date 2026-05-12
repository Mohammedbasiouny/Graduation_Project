import { BaseService } from "./Base.service";

class EduDepartmentsService extends BaseService {
  constructor() {
    super("/admin/educational-departments");
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination, governorate_id } = params;

    return this.get("", {
      params: {
        page,
        page_size,
        with_pagination,
        governorate_id,
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

export const eduDepartmentsService = new EduDepartmentsService();
