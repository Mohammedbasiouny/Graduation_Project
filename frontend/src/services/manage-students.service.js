import { BaseService } from "./Base.service";

class ManageStudentsService extends BaseService {
  constructor() {
    super("/admin/students-management");
  }

  findAllApplications(params = {}) {
    const { page, page_size, with_pagination } = params;

    return this.get("get-all", {
      params: {
        page,
        page_size,
        with_pagination,
      },
    });
  }

  findOneApplication(id) {
    return this.get(`profile-by-id/${id}`);
  }

  exportZip(data, config) {
    return this.post(`export-zip`, data, config);
  }
}

export const manageStudentsService = new ManageStudentsService();
