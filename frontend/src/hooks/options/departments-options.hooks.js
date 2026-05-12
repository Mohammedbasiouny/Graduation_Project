import { useMemo } from "react";
import { useDepartments } from "../api/departments.hooks";

export const useDepartmentsOptions = ({ faculty_id, is_visible, enabled = true } = {}) => {
  const { data, isLoading } = useDepartments(
    { 
      with_pagination: false,
      faculty_id
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
