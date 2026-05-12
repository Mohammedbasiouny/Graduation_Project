import { buildingsKeys } from "@/keys/resources/buildings.keys";
import { buildingsService } from "@/services/buildings.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useBuildings = (params = {}, options = {}) => {
  return useQuery({
    queryKey: buildingsKeys.list(params),
    queryFn: () => buildingsService.findAll(params),
    ...options,
  });
};

export const useBuilding = (id, options = {}) => {
  return useQuery({
    queryKey: buildingsKeys.detail(id),
    queryFn: () => buildingsService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateBuilding = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => buildingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildingsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateBuilding = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => buildingsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: buildingsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: buildingsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteBuilding = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => buildingsService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: buildingsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: buildingsKeys.lists(),
      });
    },
    ...options,
  });
};
