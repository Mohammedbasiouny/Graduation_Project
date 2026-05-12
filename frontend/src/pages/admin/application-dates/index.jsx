import Heading from '@/components/ui/Heading'
import AddPeriodCard from './components//cards/AddPeriodCard'
import { useTranslation } from 'react-i18next'
import DatesTable from './components/table/DatesTable'
import Pagination from '@/components/ui/Pagination'
import Search from '@/components/ui/Search'
import DeleteModal from './components/modals/DeleteModal'
import TogglePeriodCard from './components/cards/TogglePeriodCard'
import ViewModal from './components/modals/ViewModal'
import AddModal from './components/modals/AddModal'
import TogglePeriodModal from './components/modals/TogglePeriodModal'
import EditModal from './components/modals/EditModal'
import { translateNumber } from '@/i18n/utils'
import { CalendarRange, RefreshCw, Shredder } from 'lucide-react'
import CountCard from '@/components/ui/CountCard'
import { useApplicationDates } from '@/hooks/api/application-dates.hooks'
import useURLSearchParams from '@/hooks/use-URL-search-params.hook'
import { useEffect, useState } from 'react'
import { Button, IconButton } from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import { useModalStoreV2 } from '@/store/use.modal.store'
import TruncateModal from './components/modals/TruncateModal'

const ApplicationDatesPage = () => {
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
  const { data, isLoading, refetch } = useApplicationDates({
    with_pagination: getParam("with_pagination") !== "false",
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
  }, { scope: "admin" });

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
        title={t("application-dates:main_heading.title")}
        subtitle={t("application-dates:main_heading.subtitle")}
      />

      {/* Overview */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        <CountCard
          label={t("application-dates:dates_overview.total.label")}
          subtext={t("application-dates:dates_overview.total.subtext")}
          value={translateNumber(totalItems ? totalItems : t("zero"))}
          icon={CalendarRange}
          variant="gray"
        />
        <AddPeriodCard />
        <TogglePeriodCard />
      </div>

      {totalItems > 0 && (
        <Button 
          variant='danger'
          size='sm' 
          icon={<Shredder />} 
          onClick={() => openModal("truncate")}
        >
          {t("application-dates:truncate_btn")}
        </Button>
      )}

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading
            title={t('application-dates:table_heading.title')}
            subtitle={t('application-dates:table_heading.subtitle')}
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
        <DatesTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>

      <TogglePeriodModal />
      
      <ViewModal />

      <AddModal />

      <EditModal />

      <DeleteModal />

      {totalItems > 0 && (
        <TruncateModal />
      )}
    </div>
  )
}

export default ApplicationDatesPage
