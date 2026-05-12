import { translateNumber } from '@/i18n/utils';
import { useTranslation } from 'react-i18next';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table'
import { truncateText } from '@/utils/format-text.utils';
import RedirectText from '@/components/ui/RedirectText';
import { useMemo } from 'react';
import ActionButtons from './ActionButtons';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';

const GovernoratesTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("governorates:table.columns.name"),
      t("governorates:table.columns.distance_from_cairo"),
      t("governorates:table.columns.educational_departments"),
      t("governorates:table.columns.police"),
      t("governorates:table.columns.areas"),
      t("governorates:table.columns.is_visible"),
      t("governorates:table.columns.actions"),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={7} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows?.length === 0}>
      {rows.map(({ id, name, distance_from_cairo, is_visible, educational_departments_count, police_stations_count, cities_count }) => {
        const visibility = getVisibilityStatus(is_visible);

        return (
          <TRow key={id}>
            <TData isMain column={columns[0]} className='whitespace-pre-line'>
              {truncateText(name, 35, true)}
            </TData>

            <TData isMain column={columns[1]} className='whitespace-pre-line'>
              {distance_from_cairo == 0 ? t("zero") : translateNumber(distance_from_cairo)}
            </TData>
            
            <TData column={columns[2]}>
              <RedirectText 
                linkTo={`${id}/educational-departments`}
                linkText={educational_departments_count != 0 ? translateNumber(educational_departments_count) : t("zero")} 
                underlineText 
              />
            </TData>

            <TData column={columns[3]}>
              <RedirectText 
                linkTo={`${id}/police-stations`}
                linkText={police_stations_count != 0 ? translateNumber(police_stations_count) : t("zero")} 
                underlineText 
              />
            </TData>
            
            <TData column={columns[4]}>
              <RedirectText 
                linkTo={`${id}/cities`}
                linkText={cities_count != 0 ? translateNumber(cities_count) : t("zero")} 
                underlineText 
              />
            </TData>

            <TData column={columns[5]}>
              {<StatusBadge variant={visibility.variant} size="small" icon={visibility.Icon} />}
            </TData>

            {/* Actions */}
            <TData column={columns[6]} className='block'>
              <ActionButtons row={{ id }} />
            </TData>
          </TRow>
        )
      })}
    </Table>
  )
}

export default GovernoratesTable
