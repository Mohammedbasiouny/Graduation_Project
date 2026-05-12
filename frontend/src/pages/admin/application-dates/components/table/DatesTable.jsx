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


const DatesTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t('application-dates:table.columns.id'),
      t('application-dates:table.columns.who_can_apply'),
      t('application-dates:table.columns.university'),
      t('application-dates:table.columns.student_type'),
      t('application-dates:table.columns.start_date'),
      t('application-dates:table.columns.end_date'),
      t('application-dates:table.columns.status'),
      t('application-dates:table.columns.actions'),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(({ id, name, startAt, endAt, studentType, university }) => {
        const formatedStartDate = `${translateDate(formatToDateOnly(startAt))} - ${translateTime(formatToTimeOnly(startAt))}`;
        const formatedEndDate = `${translateDate(formatToDateOnly(endAt))} - ${translateTime(formatToTimeOnly(endAt))}`;
        const uniName = t(`universities.${university}`);
        const studentTypeLabel = t(`fields:student_type.options.${studentType}`);
        const { label, variant } = getPeriodStatus({ startAt, endAt });

        const periodText = getPeriodDetails({
          startAt,
          endAt,
          name,
          university: uniName,
          studentType: studentTypeLabel
        });

        return (<TRow key={id}>
          <TData isMain isAppear={false}>
            <CopyText 
              styled
              text={periodText} 
            >
              {periodText}
            </CopyText>
          </TData>
          <TData column={columns[0]}>
            {translateNumber(id)}
          </TData>
          <TData column={columns[1]}>
            {truncateText(name, 35, true)}
          </TData>
          <TData 
            column={columns[2]} 
            className='whitespace-pre-line'
          >
            {limitWords(uniName)}
          </TData>
          <TData 
            column={columns[3]} 
            className='whitespace-pre-line'
          >
            {studentTypeLabel}
          </TData>
          <TData column={columns[4]}>
            {formatedStartDate}
          </TData>
          <TData column={columns[5]}>
            {formatedEndDate}
          </TData>
          <TData column={columns[6]}>
            <StatusBadge variant={variant} size="small">
              {label}
            </StatusBadge>
          </TData>

          {/* Actions */}
          <TData column={columns[7]} className='block'>
            <ActionButtons row={{ id }} />
          </TData>
        </TRow>)
      })}
    </Table>
  )
}

export default DatesTable
