import ActionButtons from "./ActionButtons"
import { Button } from "@/components/ui/Button";
import { RoomCard, RoomCardSkeleton } from "@/components/ui/cards/RoomCard";
import { EmptyData } from "@/components/ui/Table";
import { Link } from "react-router";

const RoomsTable = ({ rows, isLoading }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <RoomCardSkeleton key={index} />
        ))
      ) : (
        rows?.length == 0 ? (
          <div className='my-10 col-span-1 md:col-span-2 lg:col-span-3'>
            <EmptyData />
          </div>
        ) : (
          rows?.map((room) => (
            <RoomCard key={room.id} room={room} >
              <ActionButtons row={{ id: room.id }} />
            </RoomCard>
          ))
        )
      )}

    </div>
  )
}

export default RoomsTable
