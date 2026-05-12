import { manageUsersKeys } from "@/keys/resources/manage-users.keys";
import { adminUserService } from "@/services/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: manageUsersKeys.list(params),
    queryFn: () => adminUserService.findAll(params),
    ...options,
  });
};

export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: manageUsersKeys.detail(id),
    queryFn: () => adminUserService.findOne(id),
    enabled: Boolean(id),
    ...options,
  });
};


/* ===================== Mutations ===================== */
export const useChangeUser = (isStudent = false, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => isStudent ? adminUserService.updateStudentInfo(id, data) : adminUserService.updateUserInfo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: manageUsersKeys.lists(),
      });
    },
    ...options,
  });
};

export const useGrantPermissions = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminUserService.grantPermissions(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: manageUsersKeys.detail(variables.id),
      });
    },
    ...options,
  });
};

export const useCreateUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => adminUserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: manageUsersKeys.lists(),
      });
    },
    ...options,
  });
};

export const useToggleUserBlock = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUserService.toggleBlock(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: manageUsersKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: manageUsersKeys.lists(),
      });
    },
    ...options,
  });
};

export const useDeleteUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUserService.remove(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: manageUsersKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: manageUsersKeys.lists(),
      });
    },
    ...options,
  });
};
