import { useMemo } from "react";
import { useGovernorates } from "@/hooks/api/governorates.hooks";

export const useGovernoratesOptions = ({ acceptance_status, is_visible } = {}) => {
  const { data, isLoading } = useGovernorates({
    with_pagination: false,
  });

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
