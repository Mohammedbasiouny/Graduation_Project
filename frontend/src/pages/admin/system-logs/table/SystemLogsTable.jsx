import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table';
import CopyText from '@/components/ui/CopyText';
import { StatusBadge } from '@/components/ui/StatusBadge';

import { translateDate, translateNumber, translateTime } from '@/i18n/utils';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { truncateText } from '@/utils/format-text.utils';
import RedirectText from '@/components/ui/RedirectText';

const SystemLogsTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t('system-logs:table.columns.id'),
      t('system-logs:table.columns.role'),
      t('system-logs:table.columns.user_name'),
      t("system-logs:table.columns.user_email"),
      t('system-logs:table.columns.user_id'),
      t('system-logs:table.columns.user_email'),
      t('system-logs:table.columns.ip_address'),
      t('system-logs:table.columns.action'),
      t('system-logs:table.columns.error_message'),
      t('system-logs:table.columns.created_at'),
    ],
    [t]
  );

  if (isLoading) {
    return (
      <TableSkeleton
        numberOfColumns={columns.length}
        defaultNumberOfRows={5}
      />
    );
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map((row) => {
        const {
          id,
          role,
          user_name,
          email,
          user_id,
          user_email,
          ip_address,
          action,
          error_message,
          created_at,
        } = row;

        const formattedDate = `${translateDate(
          formatToDateOnly(created_at)
        )} - ${translateTime(formatToTimeOnly(created_at))}`;

        return (
          <TRow key={id}>
            <TData column={columns[0]}>
              {translateNumber(id)}
            </TData>
            <TData column={columns[1]}>
              {t(`fields:role.options.${role}`)}
            </TData>
            <TData isMain column={columns[2]} className='whitespace-pre-line'>
              <RedirectText 
                linkTo={`/admin/accounts/${role}/${user_id}/`}
                linkText={translateNumber(row.user_name)} 
                underlineText 
              />
            </TData>
            <TData isMain column={columns[3]} className='whitespace-pre-line'>
              <RedirectText 
                linkTo={`/admin/accounts/${role}/${user_id}/`}
                linkText={translateNumber(row.user_email)} 
                underlineText 
              />
            </TData>
            <TData isMain column={columns[4]} className='whitespace-pre-line'>
              <RedirectText 
                linkTo={`/admin/accounts/${role}/${user_id}/`}
                linkText={translateNumber(row.user_id)} 
                underlineText 
              />
            </TData>
            <TData isMain column={columns[5]} className='whitespace-pre-line'>
              {truncateText(row.user_email)}
            </TData>
            <TData isMain column={columns[6]} className='whitespace-pre-line'>
                {ip_address}
            </TData>
            <TData column={columns[7]}>
              {t(`system-logs:actions.${action}`) || action}
            </TData>
            <TData column={columns[8]}>
              {truncateText(error_message, 40, true)}
            </TData>
            <TData column={columns[9]}>
              {formattedDate}
            </TData>
          </TRow>
        );
      })}
    </Table>
  );
};

export default SystemLogsTable;