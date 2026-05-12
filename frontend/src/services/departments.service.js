import { BaseService } from "./Base.service";

class DepartmentsService extends BaseService {
  constructor() {
    super("/admin/departments");
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination, faculty_id } = params;

    return this.get("", {
      params: {
        page,
        page_size,
        with_pagination,
        faculty_id,
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

export const departmentsService = new DepartmentsService();
