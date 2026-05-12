import CountCard from "@/components/ui/CountCard";
import Heading from "@/components/ui/Heading";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { translateNumber } from "@/i18n/utils";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { CalendarRange, ClipboardClock, RefreshCw, Shredder } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ToggleRestaurantStatusCard from "./cards/ToggleRestaurantStatusCard";
import AddMealScheduleCard from "./cards/AddMealScheduleCard";
import { Button, IconButton } from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import Search from "@/components/ui/Search";
import MealsScheduleTable from "./table/MealsScheduleTable";
import Pagination from "@/components/ui/Pagination";
import AddModal from "./modals/AddModal";
import EditScheduleModal from "./modals/EditScheduleModal";
import DeleteModal from "./modals/DeleteModal";
import ToggleRestaurantStatusModal from "./modals/ToggleRestaurantStatusModal";
import TruncateModal from "./modals/TruncateModal";
import { useMealSchedules } from "@/hooks/api/meal-schedule.hooks";

const ManageMealsSchedulePage = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();
  const { openModal } = useModalStoreV2();

  /* ---------------- Data State ---------------- */
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 0,
    total_items: 0,
  });
  const [totalItems, setTotalItems] = useState(0);

  const { data, isLoading, refetch } = useMealSchedules({
    with_pagination: getParam("with_pagination") !== "false",
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
  });

  /* ---------------- API → State ---------------- */
  useEffect(() => {
    if (!data?.data) return;

    setRows(data.data.data ?? []);
    setPagination(
      data.data.meta?.pagination ?? {
        page: 1,
        page_size: 10,
        total_pages: 0,
        total_items: 0,
      }
    );
    setTotalItems(data.data.meta?.pagination?.total_items ?? 0);
  }, [data]);

  const search = {
    id: '#ID',
    name: 'Full Name',
    status: 'Student Status',
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      <Heading
        title={t("meals-schedule:main_heading.title")}
        subtitle={t("meals-schedule:main_heading.subtitle")}
      />

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        <CountCard
          label={t("meals-schedule:overview.total.label")}
          subtext={t("meals-schedule:overview.total.subtext")}
          value={translateNumber(totalItems ? totalItems : t("zero"))}
          icon={CalendarRange}
          variant="gray"
        />
        <AddMealScheduleCard />
        <ToggleRestaurantStatusCard />
      </div>

      {totalItems > 0 && (
        <Button 
          variant='danger'
          size='sm' 
          icon={<Shredder />} 
          onClick={() => openModal("truncate")}
        >
          {t("meals-schedule:truncate_btn")}
        </Button>
      )}

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading
            title={t('meals-schedule:table_heading.title')}
            subtitle={t('meals-schedule:table_heading.subtitle')}
            size="sm"
            align="start"
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

        {/* Table */}
        <MealsScheduleTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>

      <AddModal />

      <EditScheduleModal />

      <DeleteModal />

      <TruncateModal />

      <ToggleRestaurantStatusModal />
    </div>
  )
}

export default ManageMealsSchedulePage
