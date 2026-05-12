import { perUniQualificationsKeys } from "@/keys/resources/pre-uni-qualifications.keys";
import { perUniQualificationsService } from "@/services/pre-uni-qualifications.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const usePerUniQualifications = (params = {}, options = {}) => {
  return useQuery({
    queryKey: perUniQualificationsKeys.list(params),
    queryFn: () => perUniQualificationsService.findAll(params),
    ...options,
  });
};

export const usePerUniQualification = (id, options = {}) => {
  return useQuery({
    queryKey: perUniQualificationsKeys.detail(id),
    queryFn: () => perUniQualificationsService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreatePerUniQualification = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => perUniQualificationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: perUniQualificationsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdatePerUniQualification = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => perUniQualificationsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: perUniQualificationsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: perUniQualificationsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeletePerUniQualification = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => perUniQualificationsService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: perUniQualificationsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: perUniQualificationsKeys.lists(),
      });
    },
    ...options,
  });
};
