import { regestrationKeys } from "@/keys/resources/regestration.keys";
import { manageAcceptanceService } from "@/services/manage-acceptance.service";
import { manageStudentsService } from "@/services/manage-students.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStudentsApplications = (params = {}, options = {}) => {
  return useQuery({
    queryKey: regestrationKeys.list(params),
    queryFn: () => manageStudentsService.findAllApplications(params),
    ...options,
  });
};

export const useStudentApplication = (id, options = {}) => {
  return useQuery({
    queryKey: regestrationKeys.detail(id),
    queryFn: () => manageStudentsService.findOneApplication(id),
    enabled: Boolean(id),
    ...options,
  });
};

export const useStudentApplicationResult = (id, options = {}) => {
  return useQuery({
    queryKey: regestrationKeys.result(id),
    queryFn: () => manageAcceptanceService.findStudentResult(id),
    enabled: Boolean(id),
    ...options,
  });
};

export const useUpdateApplicationResult = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => manageAcceptanceService.updateStudentResult(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.result(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.all,
      });
    },
    ...options,
  });
};