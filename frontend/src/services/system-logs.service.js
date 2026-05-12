import { BaseService } from "./Base.service";

class SystemLogsService extends BaseService {
  constructor() {
    super("/admin/audit-logs");
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination, user_id } = params;

    return this.get("", {
      params: {
        page,
        page_size,
        with_pagination,
        user_id,
      },
    });
  }
}

export const systemLogsService = new SystemLogsService();
