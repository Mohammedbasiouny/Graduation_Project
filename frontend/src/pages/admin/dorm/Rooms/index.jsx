import Heading from "@/components/ui/Heading";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import RoomsCountCard from "./cards/RoomsCountCard";
import AddRoomCard from "./cards/AddRoomCard";
import Tooltip from "@/components/ui/Tooltip";
import { IconButton } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import Search from "@/components/ui/Search";
import RoomsTable from "./table/RoomsTable";
import Pagination from "@/components/ui/Pagination";
import DeleteRoomModal from "./modals/DeleteRoomModal";
import AddRoomModal from "./modals/AddRoomModal";
import EditRoomModal from "./modals/EditRoomModal";
import ViewRoomModal from "./modals/ViewRoomModal";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useRooms } from "@/hooks/api/rooms.hooks";
import { useBuilding } from "@/hooks/api/buildings.hooks";

const RoomsPage = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();
  const { id } = useParams();

  const { openModal } = useModalStoreV2();


  /* ---------------- Data State ---------------- */
  const [rows, setRows] = useState();
  const [building, setBuilding] = useState(null);


  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 0,
    total_items: 0,
  });
  const [statistics, setStatistics] = useState({
    regular_rooms_count: 0,
    premium_rooms_count: 0,
    studying_rooms_count: 0,
    medical_rooms_count: 0,
  });
  const { data, isLoading, refetch } = useRooms({
    with_pagination: getParam("with_pagination") !== "false",
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
    building_id: id,
  });

  useEffect(() => {
    if (!data?.data?.data) return;

    setRows(data.data.data?.rooms ?? []);
    setPagination(
      data.data.meta?.pagination ?? {
        page: 1,
        page_size: 10,
        total_pages: 0,
        total_items: 0,
      }
    );
    setStatistics(data.data.data?.statistics ?? {
      regular_rooms_count: 0,
      premium_rooms_count: 0,
      studying_rooms_count: 0,
      medical_rooms_count: 0,
    });
  }, [data]);

  const { 
    data: buildingData, 
  } = useBuilding(id);

  useEffect(() => {
    if (!buildingData?.data?.data) return;
    const row = buildingData.data.data;
    setBuilding({
      buildingID: row.id,
      buildingName: row.name,
      buildingType: row.type,
      roomsCount: row.rooms_count,
    });
  }, [buildingData, t]);

  const search = {
    id: "#ID",
    name: "Full Name",
    status: "Student Status",
  }


  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col space-y-6 border border-(--gray-lightest) p-6">
      {building ? (
        <Heading
          title={t("rooms:main_heading_with_building.title", { buildingName: building?.buildingName })}
          subtitle={t("rooms:main_heading_with_building.subtitle", { roomsCount: building?.roomsCount})}
        />
      ) : (
        <Heading
          title={t("rooms:main_heading.title")}
          subtitle={t("rooms:main_heading.subtitle")}
        />
      )}


      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <RoomsCountCard
            className="h-full" 
            regularCount={statistics.regular_rooms_count}
            premiumCount={statistics.premium_rooms_count}
            studyingCount={statistics.studying_rooms_count}
            medicalCount={statistics.medical_rooms_count}
          />
        </div>

        <div className="w-full sm:w-130">
          <AddRoomCard openModal={() => openModal("add-room", { building })} />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("rooms:table_heading.title")}
            subtitle={t("rooms:table_heading.subtitle")}
            size='sm' 
            align='start' 
          />
          {/* Reload Button */}
          <Tooltip content={t("buttons:reload")}>
            <IconButton
              size="sm"
              icon={RefreshCw}
              onClick={() => refetch()}
              className="text-yellow-600 bg-yellow-50 rounded-md p-1"
            />
          </Tooltip>
        </div>

        <Search fields={search} />

        <RoomsTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>

      <ViewRoomModal />
      <AddRoomModal />
      <EditRoomModal />
      <DeleteRoomModal />
    </div>
  );
};

export default RoomsPage;
