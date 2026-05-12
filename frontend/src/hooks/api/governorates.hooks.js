import { governoratesKeys } from "@/keys/resources/governorates.keys";
import { governoratesService } from "@/services/governorates.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useGovernorates = (params = {}, options = {}) => {
  return useQuery({
    queryKey: governoratesKeys.list(params),
    queryFn: () => governoratesService.findAll(params),
    ...options,
  });
};

export const useGovernorate = (id, options = {}) => {
  return useQuery({
    queryKey: governoratesKeys.detail(id),
    queryFn: () => governoratesService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

export const useStatisticsAboutEgypt = (options = {}) => {
  return useQuery({
    queryKey: governoratesKeys.statistics,
    queryFn: () => governoratesService.getStatisticsAboutEgypt(),
    ...options,
  });
};


/* ===================== Mutations ===================== */
export const useCreateGovernorate = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => governoratesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: governoratesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateGovernorate = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => governoratesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: governoratesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: governoratesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteGovernorate = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => governoratesService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: governoratesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: governoratesKeys.lists(),
      });
    },
    ...options,
  });
};
