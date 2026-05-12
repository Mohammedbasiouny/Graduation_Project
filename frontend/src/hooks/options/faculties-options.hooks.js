import { useMemo } from "react";
import { useFaculties } from "../api/faculties.hooks";

export const useFacultiesOptions = ({ university, is_visible, enabled = true } = {}) => {
  const { data, isLoading } = useFaculties(
    { 
      with_pagination: false,
      university
    },
    {
      enabled,
    }
  );

  const options = useMemo(() => {
    return (data?.data?.data ?? [])
      .map((item) => {
        // Skip items that don't match the is_visible filter
        if (is_visible !== undefined && item.is_visible !== is_visible) {
          return null;
        }

        return {
          value: item.id,
          label: item.name,
          is_visible: item.is_visible, // include is_visible for reference
        };
      })
      .filter(Boolean); // remove nulls
  }, [data, is_visible]);

  return { options, isLoading };
};
