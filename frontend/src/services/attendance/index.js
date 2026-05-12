import { AttendanceAdminService } from "./admin.service";
import { AttendanceStudentService } from "./student.service";

export const adminService = new AttendanceAdminService();
export const studentService = new AttendanceStudentService();
