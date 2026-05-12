import { useSystemLogs } from '@/hooks/api/system-logs.hooks';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import React, { useEffect, useState } from 'react'
import SystemLogsTable from './table/SystemLogsTable';
import Heading from '@/components/ui/Heading';
import CountCard from '@/components/ui/CountCard';
import { translateNumber } from '@/i18n/utils';
import { Logs, RefreshCw } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import Search from '@/components/ui/Search';
import { IconButton } from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';

const ManageSystemLogsPage = () => {
  const { t } = useTranslation();
  const { setParam, getParam } = useURLSearchParams();
  
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 0,
    total_items: 0,
  });

  const { data, isLoading, refetch } = useSystemLogs({
    with_pagination: getParam("with_pagination"),
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

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      <Heading
        title={t("system-logs:main_heading.title")}
        subtitle={t("system-logs:main_heading.subtitle")}
      />

      <div className='w-full flex items-center justify-center gap-6'>
        <div>
          <CountCard
            className="h-full" 
            label={t("system-logs:overview.total.label")}
            subtext={t("system-logs:overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={Logs}
            variant="gray"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("system-logs:table_heading.title")}
            subtitle={t("system-logs:table_heading.subtitle")}
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

        <Search fields={[]} />

        {/* Table */}
        <SystemLogsTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>

    </div>
  )
}

export default ManageSystemLogsPage