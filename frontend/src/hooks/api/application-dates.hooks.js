import { applicationDatesKeys } from "@/keys/resources/application-dates.keys";
import { adminService, commonService, studentService } from "@/services/application-dates";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useApplicationDates = (
  params = {},
  { scope = "admin", ...options } = {}
) => {
  const services = {
    admin: () => adminService.findAll(params),
    student: () => studentService.findAll(),
    guest: () => commonService.findAll(),
  };

  return useQuery({
    queryKey: applicationDatesKeys.list(params),
    queryFn: services[scope] || services.admin,
    ...options,
  });
};

export const useCurrentApplicationDate = () => {
  return useQuery({
    queryKey: applicationDatesKeys.currentPeriod,
    queryFn: () => studentService.getCurrentPeriod(),
  });
};

export const useApplicationDateStatistics = () => {
  return useQuery({
    queryKey: applicationDatesKeys.statistics,
    queryFn: () => adminService.getStatistics(),
  });
};

export const useApplicationDate = (id, options = {}) => {
  return useQuery({
    queryKey: applicationDatesKeys.detail(id),
    queryFn: () => adminService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

export const usePeriodStatus = (options = {}) => {
  return useQuery({
    queryKey: applicationDatesKeys.periodStatus,
    queryFn: () => commonService.getPeriodStatus(),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateApplicationDate = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateApplicationDate = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteApplicationDate = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useTruncateApplicationDate = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminService.truncate(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.all,
      });
    },
    ...options,
  });
};

export const useTogglePeriodStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminService.togglePeriodStatus(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.periodStatus,
      });
    },
    ...options,
  });
};

export const useTogglePreliminaryResultAnnounced = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.togglePreliminaryResultAnnounced(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationDatesKeys.statistics,
      });
    },
    ...options,
  });
};
