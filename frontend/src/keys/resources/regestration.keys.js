import { createQueryKeys } from "../create-query-keys";

export const regestrationKeys = createQueryKeys(
  "applications",
  () => ({
    profile: ["profile"], // your custom key
    result: (id) => ["result", id],
  })
);