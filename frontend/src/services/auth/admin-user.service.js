import { BaseService } from "../Base.service";

export class AdminUserService extends BaseService {
  async changeUserEmail(userId, data) {
    try {
      const response = await this.post(`/change-email/${userId}`, data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  findAll(params = {}) {
    const { page, page_size, with_pagination } = params;

    return this.get("users", {
      params: {
        page,
        page_size,
        with_pagination,
      },
    });
  }

  findOne(id) {
    return this.get(`users/${id}`);
  }

  create(data) {
    return this.post("users", data);
  }

  updateUserInfo(id, data) {
    return this.put(`users/${id}/info`, data);
  }

  updateStudentInfo(id, data) {
    return this.put(`users/${id}/student-info`, data);
  }

  grantPermissions(id, data) {
    return this.post(`users/permissions/grant/${id}`, data);
  }

  toggleBlock(id) {
    return this.patch(`users/toggle-block/${id}`);
  }

  remove(id) {
    return this.delete(`users/${id}`);
  }
}
