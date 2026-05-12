import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/ui/Pagination';
import Search from '@/components/ui/Search';
import Heading from '@/components/ui/Heading';
import AddPoliceStationCard from './components/cards/AddPoliceStationCard';
import PoliceStationsTable from './components/table/PoliceStationsTable';
import AddModal from './components/modals/AddModal';
import EditModal from './components/modals/EditModal';
import DeleteModal from './components/modals/DeleteModal';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { usePoliceStations } from '@/hooks/api/police-stations.hooks';
import { useParams } from 'react-router';
import { translateNumber } from '@/i18n/utils';
import { RefreshCw, Shield } from 'lucide-react';
import { IconButton } from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import CountCard from '@/components/ui/CountCard';
import ViewModal from './components/modals/ViewModal';

const PoliceStationsPage = () => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();
  const { gov } = useParams();

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
  const { data, isLoading, refetch } = usePoliceStations({
    with_pagination: getParam("with_pagination") !== "false",
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
    governorate_id: gov,
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
        title={t("police-stations:main_heading.title")}
        subtitle={t("police-stations:main_heading.subtitle")}
      />

      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <CountCard
            className="h-full" 
            label={t("police-stations:police_stations_overview.total.label")}
            subtext={t("police-stations:police_stations_overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={Shield}
            variant="gray"
          />
        </div>

        <div className="w-full sm:w-130">
          <AddPoliceStationCard />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("police-stations:table_heading.title")}
            subtitle={t("police-stations:table_heading.subtitle")}
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
        <PoliceStationsTable rows={rows} isLoading={isLoading}  />

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

export default PoliceStationsPage
