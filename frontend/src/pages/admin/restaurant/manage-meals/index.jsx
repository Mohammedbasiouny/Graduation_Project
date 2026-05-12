import Pagination from "@/components/ui/Pagination";
import AddModal from "./modals/AddModal";
import DeleteModal from "./modals/DeleteModal";
import EditModal from "./modals/EditModal";
import ViewModal from "./modals/ViewModal";
import MealsTable from "./table/MealsTable";
import Search from "@/components/ui/Search";
import Tooltip from "@/components/ui/Tooltip";
import { IconButton } from "@/components/ui/Button";
import { Beef, RefreshCw } from "lucide-react";
import Heading from "@/components/ui/Heading";
import AddMealCard from "./cards/AddMealCard";
import CountCard from "@/components/ui/CountCard";
import { useTranslation } from "react-i18next";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { useEffect, useState } from "react";
import { translateNumber } from "@/i18n/utils";
import { useMeals } from "@/hooks/api/meals.hooks";

const ManageMealsPage = () => {
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

  /* ---------------- API ---------------- */
  const { data, isLoading, refetch } = useMeals({
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
        title={t("meals:main_heading.title")}
        subtitle={t("meals:main_heading.subtitle")}
      />

      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <CountCard
            className="h-full"
            label={t("meals:overview.total.label")}
            subtext={t("meals:overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={Beef}
            variant="gray"
          />
        </div>

        <div className="w-full sm:w-130">
          <AddMealCard />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading
            title={t('meals:table_heading.title')}
            subtitle={t('meals:table_heading.subtitle')}
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
        <MealsTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>

      <ViewModal />

      <AddModal />

      <EditModal />

      <DeleteModal />
    </div>
  )
}

export default ManageMealsPage
