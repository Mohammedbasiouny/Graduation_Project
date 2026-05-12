import { auditLogsKeys } from "@/keys/resources/system-logs.keys";
import { systemLogsService } from "@/services/system-logs.service";
import { useQuery } from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useSystemLogs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: auditLogsKeys.list(params),
    queryFn: () => systemLogsService.findAll(params),
    ...options,
  });
};
