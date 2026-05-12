import { useMemo } from "react";
import { useMeals } from "../api/meals.hooks";

export const useMealsOptions = ({ is_active = true, enabled = true } = {}) => {
  const { data, isLoading } = useMeals(
    { 
      with_pagination: false,
    },
    {
      enabled,
    }
  );

  const options = useMemo(() => {
    return (data?.data?.data ?? [])
      .map((item) => {
        // Skip items that don't match the is_active filter
        if (is_active !== undefined && item.is_active !== is_active) {
          return null;
        }

        return {
          value: item.id,
          label: item.name,
          is_active: item.is_active, // include is_active for reference
        };
      })
      .filter(Boolean); // remove nulls
  }, [data, is_active]);

  return { options, isLoading };
};
