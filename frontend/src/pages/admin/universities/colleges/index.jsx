import { useEffect, useState } from "react";
import { showToast } from "@/utils/toast.util";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import Heading from "@/components/ui/Heading";
import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagination";
import AddCollegeCard from "./cards/AddCollegeCard";
import CollegesTable from "./table/CollegesTable";
import AddCollegeModal from "./modals/AddCollegeModal";
import EditCollegeModal from "./modals/EditCollegeModal";
import DeleteCollegeModal from "./modals/DeleteCollegeModal";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useFaculties } from "@/hooks/api/faculties.hooks";
import { translateNumber } from "@/i18n/utils";
import { GraduationCap, RefreshCw } from "lucide-react";
import CountCard from "@/components/ui/CountCard";
import Tooltip from "@/components/ui/Tooltip";
import { IconButton } from "@/components/ui/Button";
import AddDepartmentModal from "../departments/modals/AddDepartmentModal";
import ViewDepartmentModal from "../departments/modals/ViewDepartmentModal";
import ViewCollegeModal from "./modals/ViewCollegeModal";
import EditDepartmentModal from "../departments/modals/EditDepartmentModal";
import DeleteDepartmentModal from "../departments/modals/DeleteDepartmentModal";

const CollegesPage = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();
  const navigate = useNavigate();
  const { uni } = useParams();

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
  const { data, isLoading, refetch } = useFaculties({
    with_pagination: getParam("with_pagination") !== "false",
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
    university: uni,
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

  useEffect(() => {
    const allowed = ["hu", "hnu", "hitu"];

    if (uni && !allowed.includes(uni)) {
      showToast(
        "warning",
        t("manage-universities:choose_university.messages.warning_message")
      );
      navigate(-1);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uni]);

  const search = {
    id: "#ID",
    name: "Full Name",
    status: "Student Status",
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      <Heading
        title={t(`universities.${uni}`)}
        subtitle={t("manage-colleges:main_heading.subtitle", { uni: t(`universities.${uni}`) })}
      />

      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <CountCard
            className="h-full" 
            label={t("manage-colleges:colleges_overview.total.label")}
            subtext={t("manage-colleges:colleges_overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={GraduationCap}
            variant="gray"
          />
        </div>

        <div className="w-full sm:w-130">
          <AddCollegeCard />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("manage-colleges:table_heading.title")}
            subtitle={t("manage-colleges:table_heading.subtitle")}
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

        <CollegesTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>
      <ViewCollegeModal />

      <AddCollegeModal />

      <EditCollegeModal />

      <DeleteCollegeModal />

      <ViewDepartmentModal />

      <AddDepartmentModal />

      <EditDepartmentModal />

      <DeleteDepartmentModal />
    </div>
  );
};

export default CollegesPage;
