import { useMemo } from "react";
import { usePerUniQualifications } from "@/hooks/api/pre-uni-qualifications.hooks";

export const usePreUniQualificationsOptions = ({ is_visible } = {}) => {
  const { data, isLoading } = usePerUniQualifications({ with_pagination: false });

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
          degree: item.degree,
          is_visible: item.is_visible, // add is_visible to the option
        };
      })
      .filter(Boolean); // remove nulls
  }, [data, is_visible]);

  return { options, isLoading };
};
