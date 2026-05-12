import { BaseService } from "../Base.service";

export class UserAuthService extends BaseService {
  async changePassword(data) {
    try {
      const response = await this.post("/change-password", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async getMyProfile() {
    try {
      const response = await this.get("users/me");
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async getMyEmail() {
    try {
      const response = await this.get("users/my-email");
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async changeMyEmail(data) {
    try {
      const response = await this.post("/change-email", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}