import { translateNumber } from '@/i18n/utils';
import { useTranslation } from 'react-i18next';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table';
import ActionButtons from './ActionButtons';
import { truncateText } from '@/utils/format-text.utils';
import RedirectText from '@/components/ui/RedirectText';
import { useMemo } from 'react';
import { getVisibilityStatus } from '@/utils/visibility-status.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useLocation } from 'react-router';
import { getAcceptanceStatus } from '@/utils/acceptance-status.utils';

const PoliceStationsTable = ({ rows = [], isLoading }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const columns = useMemo(
    () => [
      t('police-stations:table.columns.id'),
      t('police-stations:table.columns.name'),
      t("police-stations:table.columns.acceptance_status"),
      t('police-stations:table.columns.governorate'),
      t('police-stations:table.columns.areas'),
      t('police-stations:table.columns.is_visible'),
      t('police-stations:table.columns.actions'),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={6} defaultNumberOfRows={5} />;
  }

  const isGovernoratesInUrl = location.pathname.includes('governorates');

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(
        ({
          id,
          name,
          governorate_id,
          governorate_name,
          cities_count,
          is_visible,
          acceptance_status,
        }) => {
          const visibility = getVisibilityStatus(is_visible);
          const acceptable = getAcceptanceStatus(acceptance_status);

          // ✅ if governorates exists -> normal relative link
          // ❌ if not -> replace only police-stations in current url
          const citiesLink = isGovernoratesInUrl
            ? `${id}/cities`
            : `${location.pathname.replace(
                'police-stations',
                `governorates/${governorate_id}/police-stations`
              )}/${id}/cities`;

          return (
            <TRow key={id}>
              <TData column={columns[0]}>{translateNumber(id)}</TData>

              <TData isMain column={columns[1]} className="whitespace-pre-line">
                {truncateText(name, 35, true)}
              </TData>

              <TData column={columns[2]}>{
                  <StatusBadge variant={acceptable.variant} size="small">
                    {acceptable.label}
                  </StatusBadge>
                }
              </TData>

              <TData column={columns[3]} className="whitespace-pre-line">
                {truncateText(governorate_name, 35, true)}
              </TData>

              <TData column={columns[4]}>
                <RedirectText
                  linkTo={citiesLink}
                  linkText={
                    cities_count != 0 ? translateNumber(cities_count) : t('zero')
                  }
                  underlineText
                />
              </TData>

              <TData column={columns[5]}>
                <StatusBadge
                  variant={visibility.variant}
                  size="small"
                  icon={visibility.Icon}
                />
              </TData>

              <TData column={columns[6]} className="block">
                <ActionButtons row={{ id }} />
              </TData>
            </TRow>
          );
        }
      )}
    </Table>
  );
};

export default PoliceStationsTable;
