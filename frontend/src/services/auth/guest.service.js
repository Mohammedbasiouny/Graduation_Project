import { BaseService } from "../Base.service";

export class GuestAuthService extends BaseService {
  async signup(data) {
    try {
      const response = await this.post("/signup", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async login(data) {
    try {
      const response = await this.post("/signin", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async resendVerification(data) {
    try {
      const response = await this.post("/resend-activation", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async forgotPassword(data) {
    try {
      const response = await this.post("/forgot-password", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async checkOtp(data) {
    try {
      const response = await this.post("/check-otp", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async resetPassword(data) {
    try {
      const response = await this.post("/reset-password", data);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}