import { translateNumber } from '@/i18n/utils';
import { useTranslation } from 'react-i18next';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table'
import ActionButtons from './ActionButtons';
import { truncateText } from '@/utils/format-text.utils';
import { useMemo } from 'react';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';


const CitiesTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("cities:table.columns.id"),
      t("cities:table.columns.name"),
      t("cities:table.columns.governorate"),
      t("cities:table.columns.police_station"),
      t("cities:table.columns.is_visible"),
      t("cities:table.columns.actions"),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={6} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(({ id, name, governorate_name, police_station_name, is_visible }) => {
          const visibility = getVisibilityStatus(is_visible);

          return(
            <TRow key={id}>
              <TData column={columns[0]}>{translateNumber(id)}</TData>
              <TData isMain column={columns[1]} className='whitespace-pre-line'>{truncateText(name, 35, true)}</TData>
              <TData column={columns[2]} className='whitespace-pre-line'>{truncateText(governorate_name, 35, true)}</TData>
              <TData column={columns[3]} className='whitespace-pre-line'>{truncateText(police_station_name, 35, true)}</TData>
              <TData column={columns[4]}>
                {<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />}
              </TData>

              {/* Actions */}
              <TData column={columns[5]} className='block'>
                <ActionButtons row={{ id }} />
              </TData>
            </TRow>
          )
        })}
    </Table>
  )
}

export default CitiesTable
