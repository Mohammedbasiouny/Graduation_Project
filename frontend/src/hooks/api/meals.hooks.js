import { mealsKeys } from "@/keys/resources/meals.keys";
import { mealsService } from "@/services/meals.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useMeals = (params = {}, options = {}) => {
  return useQuery({
    queryKey: mealsKeys.list(params),
    queryFn: () => mealsService.findAll(params),
    ...options,
  });
};

export const useMeal = (id, options = {}) => {
  return useQuery({
    queryKey: mealsKeys.detail(id),
    queryFn: () => mealsService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateMeal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => mealsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mealsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateMeal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => mealsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: mealsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: mealsKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteMeal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => mealsService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: mealsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: mealsKeys.lists(),
      });
    },
    ...options,
  });
};
