import { useEffect, useState } from 'react'
import Heading from '@/components/ui/Heading'
import { useTranslation } from 'react-i18next';
import AddModal from './components/modals/AddModal';
import EditModal from './components/modals/EditModal';
import DeleteModal from './components/modals/DeleteModal';
import AddGovernorateCard from './components/cards/AddGovernorateCard';
import Search from '@/components/ui/Search';
import Pagination from '@/components/ui/Pagination';
import GovernoratesTable from './components/table/GovernoratesTable';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { useGovernorates } from '@/hooks/api/governorates.hooks';
import CountCard from '@/components/ui/CountCard';
import { translateNumber } from '@/i18n/utils';
import { MapPin, RefreshCw } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import { IconButton } from '@/components/ui/Button';
import ViewModal from './components/modals/ViewModal';

const GovernoratesPage = () => {
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
  const { data, isLoading, refetch } = useGovernorates({
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
    <div className='w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6'>
      <Heading
        title={t("egypt:main_heading.title")}
        subtitle={t("egypt:main_heading.subtitle")}
      />

      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <CountCard
            className="h-full" 
            label={t("governorates:governorates_overview.total.label")}
            subtext={t("governorates:governorates_overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={MapPin}
            variant="gray"
          />
        </div>

        <div className="w-full sm:w-130">
          <AddGovernorateCard />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("governorates:table_heading.title")}
            subtitle={t("governorates:table_heading.subtitle")}
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

        <GovernoratesTable rows={rows} isLoading={isLoading}  />

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

export default GovernoratesPage
