import { useMemo } from "react";
import { useRooms } from "../api/rooms.hooks";

export const useRoomsOptions = ({ building_id, type, available, enabled = true } = {}) => {
  const { data, isLoading } = useRooms(
    {
      with_pagination: false,
      building_id,
      type,
      available
    },
    {
      enabled,
    }
  );

  const options = useMemo(() => {
    return (data?.data?.data?.rooms ?? [])
      .map((item) => {
        return {
          value: item.id,
          label: item.name,
          floor: item.floor,
        };
      })
  }, [data]);

  return { options, isLoading };
};
