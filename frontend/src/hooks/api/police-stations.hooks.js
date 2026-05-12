import { policeStationsKeys } from "@/keys/resources/police-stations.keys";
import { policeStationsService } from "@/services/police-stations.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const usePoliceStations = (params = {}, options = {}) => {
  return useQuery({
    queryKey: policeStationsKeys.list(params),
    queryFn: () => policeStationsService.findAll(params),
    ...options,
  });
};

export const usePoliceStation = (id, options = {}) => {
  return useQuery({
    queryKey: policeStationsKeys.detail(id),
    queryFn: () => policeStationsService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreatePoliceStation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => policeStationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: policeStationsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdatePoliceStation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => policeStationsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: policeStationsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: policeStationsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeletePoliceStation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => policeStationsService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: policeStationsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: policeStationsKeys.lists(),
      });
    },
    ...options,
  });
};
