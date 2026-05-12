import { createQueryKeys } from "../create-query-keys";

export const manageUsersKeys = createQueryKeys(
  "manage-users",
  () => ({
    permission: (id) => ["permission", id],
  })
);

