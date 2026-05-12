import { useQuery } from "@tanstack/react-query";
import { attendanceKeys } from "@/keys/resources/attendance.keys";
import { adminService, studentService } from "@/services/attendance";

export const useAttendanceCalendarDates = (
  studentId,
  params = {},
  { scope = "admin", ...options } = {}
) => {
  const services = {
    admin: () => adminService.studentCalendar(studentId, params),
    student: () => studentService.studentCalendar(params),
  };

  return useQuery({
    queryKey: attendanceKeys.list({ studentId, ...params }),
    queryFn: services[scope] || services.student,
    ...options,
  });
};