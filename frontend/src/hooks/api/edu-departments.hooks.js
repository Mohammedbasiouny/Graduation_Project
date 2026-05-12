import { eduDepartmentsKeys } from "@/keys/resources/edu-departments.keys";
import { eduDepartmentsService } from "@/services/edu-departments.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useEduDepartments = (params = {}, options = {}) => {
  return useQuery({
    queryKey: eduDepartmentsKeys.list(params),
    queryFn: () => eduDepartmentsService.findAll(params),
    ...options,
  });
};

export const useEduDepartment = (id, options = {}) => {
  return useQuery({
    queryKey: eduDepartmentsKeys.detail(id),
    queryFn: () => eduDepartmentsService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateEduDepartment = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => eduDepartmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eduDepartmentsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateEduDepartment = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => eduDepartmentsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: eduDepartmentsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: eduDepartmentsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteEduDepartment = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eduDepartmentsService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: eduDepartmentsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: eduDepartmentsKeys.lists(),
      });
    },
    ...options,
  });
};
