import { BaseService } from "./Base.service";

class RoomsService extends BaseService {
  constructor() {
    super("/admin/rooms");
  }

  findAll(params = {}) {
    const { building_id, type, available, page, page_size, with_pagination } = params;

    return this.get("", {
      params: {
        building_id,
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

export const roomsService = new RoomsService();
