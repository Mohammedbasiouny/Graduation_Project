import { useMemo } from "react";
import { useBuildings } from "../api/buildings.hooks";

export const useBuildingsOptions = ({ type, available, enabled = true } = {}) => {
  const { data, isLoading } = useBuildings(
    {
      with_pagination: false,
      type,
      available
    },
    {
      enabled,
    }
  );

  const options = useMemo(() => {
    return (data?.data?.data?.buildings ?? [])
      .map((item) => {
        return {
          value: item.id,
          label: item.name,
          floors_count: item.floors_count,
        };
      })
  }, [data]);

  return { options, isLoading };
};
