import { AdminUserService } from "./admin-user.service";
import { GuestAuthService } from "./guest.service";
import { UserAuthService } from "./user.service";

export const guestAuthService = new GuestAuthService();
export const userAuthService = new UserAuthService();
export const adminUserService = new AdminUserService();
