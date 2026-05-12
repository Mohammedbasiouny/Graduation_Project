import Heading from "@/components/ui/Heading";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/ui/Tooltip";
import { IconButton } from "@/components/ui/Button";
import { RefreshCw, UserRound } from "lucide-react";
import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagination";
import ResidentsTable from "./table/ResidentsTable";
import CountCard from "@/components/ui/CountCard";
import { translateNumber } from "@/i18n/utils";

const ManageResidentsPage = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([{
    id: 1,
    full_name: "محمد طارق جابر سيد",
    gender: "male",
    university: "hu",
    college: "كلية هندسة",
    building: "المبنى 1",
    room: "الفرفة 1",
    have_face_id: false,
  }]);
  const [totalItems, setTotalItems] = useState(0);

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 0,
    total_items: 0,
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* HEADER */}
      <Heading
        title={t("manage-residents:main_heading.title")}
        subtitle={t("manage-residents:main_heading.subtitle")}
      />

      <div className='w-full flex items-center justify-center gap-6'>
        <div>
          <CountCard
            className="h-full" 
            label={t("manage-residents:overview.total.label")}
            subtext={t("manage-residents:overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={UserRound}
            variant="gray"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("manage-residents:table_heading.title")}
            subtitle={t("manage-residents:table_heading.subtitle")}
            size='sm' 
            align='start' 
          />
          {/* Reload Button */}
          <Tooltip content={t("buttons:reload")}>
            <IconButton
              size="sm"
              icon={RefreshCw}
              // onClick={() => refetch()}
              className="text-yellow-600 bg-yellow-50 rounded-md p-1"
            />
          </Tooltip>
        </div>

        <Search fields={{}} />

        {/* Table */}
        <ResidentsTable rows={rows} isLoading={false} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={false} />
      </div>
    </div>
  );
};

export default ManageResidentsPage;