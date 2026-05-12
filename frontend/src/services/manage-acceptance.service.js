import { BaseService } from "./Base.service";

class ManageAcceptanceService extends BaseService {
  constructor() {
    super("/admin/acceptance");
  }

  findStudentResult(id) {
    return this.get(`/${id}/result`);
  }

  updateStudentResult(id, data) {
    return this.put(`/${id}/result`, data);
  }

  downloadStudents(id, data, config) {
    return this.post(`phase/${id}/download`, data, config);
  }

  uploadStudents(id, data) {
    return this.post(`phase/${id}/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  findAiTasks(params = {}) {
    return this.get("get-ai-tasks", {
      params,
    });
  }
}

export const manageAcceptanceService = new ManageAcceptanceService();
