import { useEffect, useState } from "react";
import { showToast } from "@/utils/toast.util";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import Heading from "@/components/ui/Heading";
import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagination";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { translateNumber } from "@/i18n/utils";
import { Computer, RefreshCw } from "lucide-react";
import CountCard from "@/components/ui/CountCard";
import Tooltip from "@/components/ui/Tooltip";
import { IconButton } from "@/components/ui/Button";
import { useDepartments } from "@/hooks/api/departments.hooks";
import AddDepartmentCard from "./cards/AddDepartmentCard";
import DepartmentsTable from "./table/DepartmentsTable";
import { useFaculty } from "@/hooks/api/faculties.hooks";
import DeleteDepartmentModal from "./modals/DeleteDepartmentModal";
import AddDepartmentModal from "./modals/AddDepartmentModal";
import { useModalStoreV2 } from "@/store/use.modal.store";
import EditDepartmentModal from "./modals/EditDepartmentModal";
import ViewDepartmentModal from "./modals/ViewDepartmentModal";

const DepartmentsPage = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();
  const navigate = useNavigate();
  const { uni, collegeID } = useParams();

  const { openModal } = useModalStoreV2();


  /* ---------------- Data State ---------------- */
  const [rows, setRows] = useState([]);
  const [college, setCollege] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 0,
    total_items: 0,
  });

  const [totalItems, setTotalItems] = useState(0);

  /* ---------------- API ---------------- */
  const { data, isLoading, refetch } = useDepartments({
    with_pagination: getParam("with_pagination") !== "false",
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
    faculty_id: collegeID,
  });

  const { 
    data: collegeData, 
  } = useFaculty(collegeID);

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

  useEffect(() => {
    if (!collegeData?.data?.data) return;

    const row = collegeData.data.data;

    setCollege({
      collegeID: row.id,
      collegeName: row.name,
      university: row.university,
      departmentsCount: row.departments_count == 0 ? t("zero") : translateNumber(row.departments_count),
    });
  }, [t, collegeData]);

  const search = {
    id: "#ID",
    name: "Full Name",
    status: "Student Status",
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      {college ? (
        <Heading
          title={t("manage-departments:main_heading_with_college.title", { university: t(`universities.${college?.university}`), collegeName: college?.collegeName })}
          subtitle={t("manage-departments:main_heading_with_college.subtitle", { departmentsCount: college?.departmentsCount})}
        />
      ) : (
        <Heading
          title={t("manage-departments:main_heading.title")}
          subtitle={t("manage-departments:main_heading.subtitle")}
        />
      )}

      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <CountCard
            className="h-full" 
            label={t("manage-departments:departments_overview.total.label")}
            subtext={t("manage-departments:departments_overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={Computer}
            variant="gray"
          />
        </div>

        <div className="w-full sm:w-130">
          <AddDepartmentCard openModal={() => openModal("add-department", { college })} />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("manage-departments:table_heading.title")}
            subtitle={t("manage-departments:table_heading.subtitle")}
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

        <DepartmentsTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>
      <ViewDepartmentModal />
      
      <AddDepartmentModal />

      <EditDepartmentModal />

      <DeleteDepartmentModal />
    </div>
  );
};

export default DepartmentsPage;
