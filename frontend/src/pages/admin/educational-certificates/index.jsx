import Heading from '@/components/ui/Heading'
import AddCertificateCard from './components//cards/AddCertificateCard'
import { useTranslation } from 'react-i18next'
import CertificatesTable from './components/table/CertificatesTable'
import Pagination from '@/components/ui/Pagination'
import Search from '@/components/ui/Search'
import DeleteModal from './components/modals/DeleteModal'
import ViewModal from './components/modals/ViewModal'
import AddModal from './components/modals/AddModal'
import EditModal from './components/modals/EditModal'
import Tooltip from '@/components/ui/Tooltip'
import { IconButton } from '@/components/ui/Button'
import { FileBadge, RefreshCw } from 'lucide-react'
import { translateNumber } from '@/i18n/utils'
import CountCard from '@/components/ui/CountCard'
import { useEffect, useState } from 'react'
import useURLSearchParams from '@/hooks/use-URL-search-params.hook'
import { usePerUniQualifications } from '@/hooks/api/pre-uni-qualifications.hooks'

const EducationalCertificatesPage = () => {
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
  const { data, isLoading, refetch } = usePerUniQualifications({
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
        title={t("educational-certificates:main_heading.title")}
        subtitle={t("educational-certificates:main_heading.subtitle")}
      />

      <div className="flex flex-wrap justify-center gap-5">
        <div className="w-full sm:w-130">
          <CountCard
            className="h-full" 
            label={t("educational-certificates:certificates_overview.total.label")}
            subtext={t("educational-certificates:certificates_overview.total.subtext")}
            value={translateNumber(totalItems ? totalItems : t("zero"))}
            icon={FileBadge}
            variant="gray"
          />
        </div>

        <div className="w-full sm:w-130">
          <AddCertificateCard />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading 
            title={t("educational-certificates:table_heading.title")}
            subtitle={t("educational-certificates:table_heading.subtitle")}
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
        <CertificatesTable rows={rows} isLoading={isLoading} />

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

export default EducationalCertificatesPage
