import { ApplicationDatesAdminService } from "./admin.service";
import { ApplicationDatesCommonService } from "./common.service";
import { ApplicationDatesStudentService } from "./student.service";

export const commonService = new ApplicationDatesCommonService();
export const adminService = new ApplicationDatesAdminService();
export const studentService = new ApplicationDatesStudentService();
