import { mealScheduleKeys } from "@/keys/resources/meal-schedule.keys";
import { mealScheduleService } from "@/services/meal-schedule.service";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

/* ===================== Queries ===================== */
export const useMealSchedules = (params = {}, options = {}) => {
  return useQuery({
    queryKey: mealScheduleKeys.list(params),
    queryFn: () => mealScheduleService.findAll(params),
    ...options,
  });
};

export const useMealSchedule = (id, options = {}) => {
  return useQuery({
    queryKey: mealScheduleKeys.detail(id),
    queryFn: () => mealScheduleService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};

/* ===================== Mutations ===================== */
export const useCreateMealSchedule = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => mealScheduleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mealScheduleKeys.lists(),
      });
    },
    ...options,
  });
};

export const useUpdateMealSchedule = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => mealScheduleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: mealScheduleKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: mealScheduleKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteMealSchedule = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => mealScheduleService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: mealScheduleKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: mealScheduleKeys.lists(),
      });
    },
    ...options,
  });
};
