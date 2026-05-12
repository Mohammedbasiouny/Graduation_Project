import { translateNumber } from '@/i18n/utils';
import { useTranslation } from 'react-i18next';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table'
import ActionButtons from './ActionButtons';
import { truncateText } from '@/utils/format-text.utils';
import { useMemo } from 'react';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';


const EducationalDepartmentsTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("educational-departments:table.columns.id"),
      t("educational-departments:table.columns.name"),
      t("educational-departments:table.columns.acceptance_status"),
      t("educational-departments:table.columns.governorate"),
      t("educational-departments:table.columns.is_visible"),
      t("educational-departments:table.columns.actions"),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={5} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(({ id, name, governorate_name, is_visible, acceptance_status }) => {
        const visibility = getVisibilityStatus(is_visible);
        const acceptable = getAcceptanceStatus(acceptance_status)
        
        return (
          <TRow key={id}>
            <TData column={columns[0]}>{translateNumber(id)}</TData>
            
            <TData isMain column={columns[1]} className='whitespace-pre-line'>{truncateText(name, 35, true)}</TData>
            
            <TData column={columns[5]}>{
                <StatusBadge variant={acceptable.variant} size="small">
                  {acceptable.label}
                </StatusBadge>
              }
            </TData>

            <TData column={columns[2]} className='whitespace-pre-line'>{truncateText(governorate_name, 35, true)}</TData>
            
            <TData column={columns[3]}>
              {<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />}
            </TData>

            {/* Actions */}
            <TData column={columns[4]} className='block'>
              <ActionButtons row={{ id }} />
            </TData>
          </TRow>
        )
      })}
    </Table>
  )
}

export default EducationalDepartmentsTable
