import { citiesKeys } from "@/keys/resources/cities.keys";
import { citiesService } from "@/services/cities.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useCities = (params = {}, options = {}) => {
  return useQuery({
    queryKey: citiesKeys.list(params),
    queryFn: () => citiesService.findAll(params),
    ...options,
  });
};

export const useCity = (id, options = {}) => {
  return useQuery({
    queryKey: citiesKeys.detail(id),
    queryFn: () => citiesService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateCity = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => citiesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: citiesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateCity = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => citiesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: citiesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: citiesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteCity = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => citiesService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: citiesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: citiesKeys.lists(),
      });
    },
    ...options,
  });
};
