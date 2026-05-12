import { translateDate, translateNumber, translateTime } from '@/i18n/utils';
import { useTranslation } from 'react-i18next';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table'
import CopyText from '@/components/ui/CopyText';
import ActionButtons from './ActionButtons';
import { limitWords, truncateText } from '@/utils/format-text.utils';
import { useMemo } from 'react';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getPeriodDetails, getPeriodStatus } from '@/utils/application-dates.utils';
import { getAccountActivatedStatus } from '@/utils/account-activated-status.utils';
import { X } from 'lucide-react';
import { getAccountBlockedStatus } from '@/utils/account-blocked-status.utils';


const UsersTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t('account:columns.id'),
      t('account:columns.email'),
      t('account:columns.is_active'),
      t('account:columns.role'),
      t('account:columns.permissions_count'),
      t('account:columns.blocked'),
      t('account:columns.created_at'),
      t('account:columns.actions'),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={8} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(({ id, email, is_active, role, permissions_count, end_date, created_at }) => {
        const formatedCreatedDate = formatToDateOnly(created_at);
        const isActive = getAccountActivatedStatus(is_active);
        const isBlocked = getAccountBlockedStatus(end_date);

        return (<TRow key={id}>
          <TData column={columns[0]}>
            {translateNumber(id)}
          </TData>
          <TData 
            isMain
            column={columns[1]} 
          >
            {limitWords(email)}
          </TData>
          <TData column={columns[2]}>
            <StatusBadge variant={isActive.variant} size="small">
              {isActive.label}
            </StatusBadge>
          </TData>
          <TData column={columns[3]}>
            {t(`fields:role.options.${role}`)}
          </TData>
          <TData column={columns[4]}>
            {permissions_count == 0 ? t("zero") : translateNumber(permissions_count)}
          </TData>
          <TData column={columns[5]}>
            <StatusBadge variant={isBlocked.variant} size="small">
              {isBlocked.label}
            </StatusBadge>
          </TData>
          <TData column={columns[6]}>
            {`${translateDate(formatToDateOnly(created_at))}  -  ${translateTime(formatToTimeOnly(created_at))}`}
          </TData>

          {/* Actions */}
          <TData column={columns[7]} className='block'>
            <ActionButtons row={{ id, role }} />
          </TData>
        </TRow>)
      })}
    </Table>
  )
}

export default UsersTable
