import { IconButton } from '@/components/ui/Button';
import CountCard from '@/components/ui/CountCard';
import Heading from '@/components/ui/Heading';
import Pagination from '@/components/ui/Pagination';
import Search from '@/components/ui/Search';
import Tooltip from '@/components/ui/Tooltip';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { translateNumber } from '@/i18n/utils';
import { Files, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import StudentApplicationsTable from './components/table/StudentApplicationsTable';
import ExportStudentsCard from './components/cards/ExportStudentsCard';
import { useStudentsApplications } from '@/hooks/api/students-applications.hooks';
import ManageAcceptanceCard from './components/cards/ManageAcceptanceCard';

const TrackApplicationsPage = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();

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
  const { data, isLoading, refetch } = useStudentsApplications({
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
    id: "#ID",
    name: "Full Name",
    status: "Student Status",
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      <Heading
        title={t("manage-student-applications:main_heading.title")}
        subtitle={t("manage-student-applications:main_heading.subtitle")}
      />

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        <CountCard
          className="h-full" 
          label={t("manage-student-applications:overview.total.label")}
          subtext={t("manage-student-applications:overview.total.subtext")}
          value={translateNumber(totalItems ? totalItems : t("zero"))}
          icon={Files}
          variant="gray"
        />
        <ExportStudentsCard />
        <ManageAcceptanceCard />
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("manage-student-applications:table_heading.title")}
            subtitle={t("manage-student-applications:table_heading.subtitle")}
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

        {/* Table */}
        <StudentApplicationsTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default TrackApplicationsPage
