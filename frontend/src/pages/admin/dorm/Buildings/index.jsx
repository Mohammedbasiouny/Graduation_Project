import { useEffect, useState } from "react";
import Heading from "@/components/ui/Heading";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Tooltip from "@/components/ui/Tooltip";
import { IconButton } from "@/components/ui/Button";
import BuildingsTable from "./table/BuildingsTable";
import { Mars, RefreshCw, Venus } from "lucide-react";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import AddBuildingCard from "./cards/AddBuildingCard";
import CountCard from "@/components/ui/CountCard";
import BuildingsGenderCountCard from "./cards/BuildingsGenderCountCard";
import DeleteBuildingModal from "./modals/DeleteBuildingModal";
import AddBuildingModal from "./modals/AddBuildingModal";
import EditBuildingModal from "./modals/EditBuildingModal";
import ViewBuildingModal from "./modals/ViewBuildingModal";
import AddRoomModal from "../Rooms/modals/AddRoomModal";
import EditRoomModal from "../Rooms/modals/EditRoomModal";
import DeleteRoomModal from "../Rooms/modals/DeleteRoomModal";
import ViewRoomModal from "../Rooms/modals/ViewRoomModal";
import { useBuildings } from "@/hooks/api/buildings.hooks";

const BuildingsPage = () => {
  const { t } = useTranslation();
  const { setParam, getParam } = useURLSearchParams();

  /* ---------------- Data State ---------------- */
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 0,
    total_items: 0,
  });
  const [statistics, setStatistics] = useState({
    male_buildings_count: 0,
    female_buildings_count: 0,
  });

  /* ---------------- API ---------------- */
  const { data, isLoading, refetch } = useBuildings({
    with_pagination: getParam("with_pagination") !== "false",
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
  });
  
  useEffect(() => {
    if (!data?.data) return;

    setRows(data.data.data?.buildings ?? []);
    setPagination(
      data.data.meta?.pagination ?? {
        page: 1,
        page_size: 10,
        total_pages: 0,
        total_items: 0,
      }
    );
    setStatistics(data.data.data?.statistics ?? {
      male_buildings_count: 0,
      female_buildings_count: 0,
    });
  }, [data]);

  const search = {
    id: "#ID",
    name: "Full Name",
    status: "Student Status",
  }

  useEffect(() => {
    setParam("with_pagination", "false")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col space-y-6 border border-(--gray-lightest) p-6">
      <Heading
        title={t("buildings:main_heading.title")}
        subtitle={t("buildings:main_heading.subtitle")}
      />

      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <BuildingsGenderCountCard
            className="h-full" 
            maleCount={statistics.male_buildings_count}
            femaleCount={statistics.female_buildings_count}
          />
        </div>

        <div className="w-full sm:w-130">
          <AddBuildingCard />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("buildings:table_heading.title")}
            subtitle={t("buildings:table_heading.subtitle")}
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

        <BuildingsTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>

      <ViewBuildingModal />

      <AddBuildingModal />

      <EditBuildingModal />

      <DeleteBuildingModal />

      <ViewRoomModal />

      <AddRoomModal />

      <EditRoomModal />
      
      <DeleteRoomModal />
    </div>
  );
};

export default BuildingsPage;
