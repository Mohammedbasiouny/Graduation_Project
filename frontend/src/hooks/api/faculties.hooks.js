import { facultiesKeys } from "@/keys/resources/faculties.keys";
import { facultiesService } from "@/services/faculties.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useFaculties = (params = {}, options = {}) => {
  return useQuery({
    queryKey: facultiesKeys.list(params),
    queryFn: () => facultiesService.findAll(params),
    ...options,
  });
};

export const useFaculty = (id, options = {}) => {
  return useQuery({
    queryKey: facultiesKeys.detail(id),
    queryFn: () => facultiesService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateFaculty = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => facultiesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: facultiesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateFaculty = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => facultiesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: facultiesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: facultiesKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteFaculty = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => facultiesService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: facultiesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: facultiesKeys.lists(),
      });
    },
    ...options,
  });
};
