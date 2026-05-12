import { useMemo } from "react";
import { useCities } from "@/hooks/api/cities.hooks";

export const useCitiesOptions = ({ governorate_id, police_station_id, acceptance_status, is_visible, enabled = true } = {}) => {
  const { data, isLoading } = useCities(
    {
      with_pagination: false,
      governorate_id,
      police_station_id
    },
    {
      enabled,
    }
  );

  const options = useMemo(() => {
    return (data?.data?.data ?? [])
      .map(item => {
        // Skip items that don't match the filters
        if (
          (acceptance_status !== undefined && item.acceptance_status !== acceptance_status) ||
          (is_visible !== undefined && item.is_visible !== is_visible)
        ) {
          return null;
        }

        return {
          value: item.id,
          label: item.name,
        };
      })
      .filter(Boolean); // remove nulls
  }, [data, acceptance_status, is_visible]);

  return { options, isLoading };
};
