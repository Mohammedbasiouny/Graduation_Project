import { departmentsKeys } from "@/keys/resources/departments.keys";
import { departmentsService } from "@/services/departments.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useDepartments = (params = {}, options = {}) => {
  return useQuery({
    queryKey: departmentsKeys.list(params),
    queryFn: () => departmentsService.findAll(params),
    ...options,
  });
};

export const useDepartment = (id, options = {}) => {
  return useQuery({
    queryKey: departmentsKeys.detail(id),
    queryFn: () => departmentsService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateDepartment = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => departmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: departmentsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateDepartment = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => departmentsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: departmentsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: departmentsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteDepartment = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => departmentsService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: departmentsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: departmentsKeys.lists(),
      });
    },
    ...options,
  });
};
