import { manageAcceptanceService } from "@/services/manage-acceptance.service";
import { useQuery } from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useAiTasks = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["ai-tasks"],
    queryFn: () => manageAcceptanceService.findAiTasks(params),
    ...options,
  });
};