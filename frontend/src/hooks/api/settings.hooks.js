import { settingsKeys } from "@/keys/resources/settings.keys";
import { settingsService } from "@/services/settings.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSettings = (options = {}) => {
  return useQuery({
    queryKey: settingsKeys.detail(1),
    queryFn: () => settingsService.find(),
    ...options,
  });
};

export const useUpdateSettings = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => settingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.detail(1),
      });
    },
    ...options,
  });
};