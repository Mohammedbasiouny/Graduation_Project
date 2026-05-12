import React, { useEffect, useState } from 'react'
import AccountsRoleCountCard from './cards/AccountsRoleCountCard'
import Heading from '@/components/ui/Heading'
import AddUserCard from './cards/AddUserCard'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/ui/Button'
import { RefreshCw } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import Search from '@/components/ui/Search'
import Pagination from '@/components/ui/Pagination'
import UsersTable from './table/UsersTable'
import DeleteUserModal from '../modals/DeleteUserModal'
import useURLSearchParams from '@/hooks/use-URL-search-params.hook'
import { useUsers } from '@/hooks/api/manage-users.hook'

const AccountsPage = () => {
  const { t } = useTranslation();
  const { setParam, getParam } = useURLSearchParams();

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total_pages: 0,
    total_items: 0,
  });
  const [statistics, setStatistics] = useState({
    admins: 0,
    maintenance: 0,
    students: 0,
    medical: 0,
    cafeteria: 0,
    supervisors: 0
  });
  
  const { data, isLoading, refetch } = useUsers({
    with_pagination: getParam("with_pagination"),
    page: getParam('page', Number) ?? 1,
    page_size: getParam('page_size', Number) ?? 10,
  });

  useEffect(() => {
    if (!data?.data) return;

    setRows(data.data.data?.users ?? []);
    setPagination(
      data.data.meta?.pagination ?? {
        page: 1,
        page_size: 10,
        total_pages: 0,
        total_items: 0,
      }
    );
    setStatistics(data.data.data?.statistics ?? {
      admins: 0,
      maintenance: 0,
      students: 0,
      medical: 0,
      cafeteria: 0,
      supervisors: 0
    });
  }, [data]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      <Heading
        title={t("account:accounts_heading.title")}
        subtitle={t("account:accounts_heading.subtitle")}
      />

      <div className="flex flex-wrap items-stretch justify-center gap-5">
        <div className="w-full sm:w-fit">
          <AccountsRoleCountCard
            statistics={statistics}
          />
        </div>
        <div className="w-full sm:w-130">
          <AddUserCard />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full mt-5">
        <div className="flex items-center justify-between">
          <Heading
            title={t('account:table_accounts_heading.title')}
            subtitle={t('account:table_accounts_heading.subtitle')}
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

        <Search fields={[]} />

        <UsersTable rows={rows} isLoading={isLoading} />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} isLoading={isLoading} />
      </div>

      <DeleteUserModal />
    </div>
  )
}

export default AccountsPage
