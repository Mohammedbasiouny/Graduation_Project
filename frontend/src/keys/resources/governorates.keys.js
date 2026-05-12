import { createQueryKeys } from "../create-query-keys";

export const governoratesKeys = createQueryKeys(
  "governorates",
  () => ({
    statistics: ["statistics"], // your custom key
  })
);

