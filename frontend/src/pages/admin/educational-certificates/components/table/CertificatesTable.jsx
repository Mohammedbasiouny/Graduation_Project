import { translateNumber } from '@/i18n/utils';
import { useTranslation } from 'react-i18next';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table'
import ActionButtons from './ActionButtons';
import { useMemo } from 'react';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';


const CertificatesTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("educational-certificates:table.columns.id"),
      t("educational-certificates:table.columns.name"),
      t("educational-certificates:table.columns.degree"),
      t("educational-certificates:table.columns.is_visible"),
      t("educational-certificates:table.columns.actions"),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={5} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows?.length === 0}>
      {rows.map((row) => {
        const visibility = getVisibilityStatus(row.is_visible);

        return (
          <TRow key={row.id}>
            <TData column={columns[0]}>
              {translateNumber(row.id)}
            </TData>
            <TData 
              isMain 
              column={columns[1]} 
              className='whitespace-pre-line'
            >
              {row.name}
            </TData>
            <TData column={columns[2]}>
              {row.degree != 0 ? translateNumber(row.degree) : t("zero")}
            </TData>
            <TData column={columns[3]}>
              {<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />}
            </TData>

            {/* Actions */}
            <TData column={columns[4]} className='block'>
              <ActionButtons row={row} />
            </TData>
          </TRow>
        )
      })}
    </Table>
  )
}

export default CertificatesTable
