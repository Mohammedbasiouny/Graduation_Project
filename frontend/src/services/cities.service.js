import { BaseService } from "./Base.service";

class CitiesService extends BaseService {
  constructor() {
    super("/admin/cities");
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination, governorate_id, police_station_id } = params;

    return this.get("", {
      params: {
        page,
        page_size,
        with_pagination,
        governorate_id,
        police_station_id,
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

export const citiesService = new CitiesService();
