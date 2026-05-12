import { BuildingCard, BuildingCardSkeleton } from "@/components/ui/cards/BuildingCard"
import ActionButtons from "./ActionButtons"
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { Link } from "react-router";
import { EmptyData } from "@/components/ui/Table";

const BuildingsTable = ({ rows, isLoading = false }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <BuildingCardSkeleton key={index} />
        ))
      ) : (
        rows.length == 0 ? (
          <div className='my-10 col-span-1 md:col-span-2 xl:col-span-3'>
            <EmptyData />
          </div>
        ) : (
          rows.map((building) => (
            <BuildingCard key={building.id} building={building} >
              <div className="w-full flex flex-wrap justify-center xl:justify-between gap-3">
                <Button 
                  variant="success" 
                  size="xs"
                  onClick={ () => openModal("add-room", { 
                      building: { 
                        buildingID: building.id, 
                        buildingType: building.type, 
                        buildingName: building.name 
                      } 
                    })
                  }
                >
                  {t(`buildings:add_room_btn`)}
                </Button>
                <ActionButtons row={{ id: building.id }} />
              </div>
              <Link
                to={`${building.id}/rooms`}
                className="text-blue-600 hover:underline underline text-sm sm:text-base md:text-base lg:text-base font-semibold cursor-pointer"
              >
                {t(`buildings:rooms_link`)}
              </Link>
            </BuildingCard>
          ))
        )
      )}

    </div>
  )
}

export default BuildingsTable
