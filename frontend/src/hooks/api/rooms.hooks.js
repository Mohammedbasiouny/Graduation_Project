import { roomsKeys } from "@/keys/resources/rooms.keys";
import { roomsService } from "@/services/rooms.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useRooms = (params = {}, options = {}) => {
  return useQuery({
    queryKey: roomsKeys.list(params),
    queryFn: () => roomsService.findAll(params),
    ...options,
  });
};

export const useRoom = (id, options = {}) => {
  return useQuery({
    queryKey: roomsKeys.detail(id),
    queryFn: () => roomsService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateRoom = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => roomsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roomsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateRoom = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => roomsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roomsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: roomsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteRoom = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => roomsService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roomsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: roomsKeys.lists(),
      });
    },
    ...options,
  });
};
