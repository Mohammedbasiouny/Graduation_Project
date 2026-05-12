import { createQueryKeys } from "../create-query-keys";

export const applicationDatesKeys = createQueryKeys(
  "application-dates",
  () => ({
    periodStatus: ["period-status"],
    currentPeriod: ["current-period"],
    statistics: ["statistics"],
  })
);
