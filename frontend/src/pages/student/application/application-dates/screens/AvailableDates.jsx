import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { limitWords } from '@/utils/format-text.utils';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table'
import { translateDate, translateTime } from '@/i18n/utils';
import { NavLink } from 'react-router';
import { useApplicationDates } from '@/hooks/api/application-dates.hooks';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { getPeriodStatus } from '@/utils/application-dates.utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

const AvailableDates = () => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("application-dates:table.columns.who_can_apply"),
      t("application-dates:table.columns.university"),
      t("application-dates:table.columns.student_type"),
      t("application-dates:table.columns.start_date"),
      t("application-dates:table.columns.end_date"),
      t("application-dates:table.columns.status"),
    ],
    [t]
  );

  /* ---------------- Data State ---------------- */
  const [rows, setRows] = useState([]);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useApplicationDates({}, { scope: "student" });

  /* ---------------- API → State ---------------- */
  useEffect(() => {
    if (!data?.data) return;

    setRows(data.data.data ?? []);
  }, [data]);

  return (
    <div className='w-full flex flex-col items-center space-y-10 p-6'>
      <Heading
        title={t("application-dates:main_heading.title")}
        subtitle={t("application-dates:main_heading.subtitle")}
      />

      <div className='min-w-7xl space-y-5'>
        {isLoading ? (
          <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
        ) : (
          <Table columns={columns} isEmpty={rows.length === 0}>
            {rows.map(({ id, name, studentType, startAt, endAt, university }) => {
              const formatedStartDate = `${translateDate(formatToDateOnly(startAt))} - ${translateTime(formatToTimeOnly(startAt))}`;
              const formatedEndDate = `${translateDate(formatToDateOnly(endAt))} - ${translateTime(formatToTimeOnly(endAt))}`;
              const uniName = t(`universities.${university}`);
              const { label, variant } = getPeriodStatus({ startAt, endAt });
              const studentTypeLabel = t(`fields:student_type.options.${studentType}`);

              return (<TRow key={id}>
                <TData column={columns[0]} isMain className='whitespace-pre-line'>{limitWords(name, 10)}</TData>
                <TData column={columns[1]} className='whitespace-pre-line'>{limitWords(uniName)}</TData>
                <TData 
                  column={columns[2]} 
                  className='whitespace-pre-line'
                >
                  {studentTypeLabel}
                </TData>
                <TData column={columns[3]}>{formatedStartDate}</TData>
                <TData column={columns[4]}>{formatedEndDate}</TData>
                <TData column={columns[5]}>
                  <StatusBadge variant={variant} size="small">
                    {label}
                  </StatusBadge>
                </TData>
              </TRow>)
            })}
          </Table>
        )}
        <Alert 
          type='info'
          dismissible={false}
          title={t("application-dates:important_notice.title")}
          collapsible
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-dates:important_notice.description")}
          </p>
        </Alert>
      </div>

      {rows.length !== 0 && (
        <NavLink to={"/student/choose-nationality"}>
          <div>
            <Button size={"lg"} variant={"secondary"}>
              {t("application-dates:apply_btn")}
            </Button>
          </div>
        </NavLink>
      )}
    </div>
  )
}

export default AvailableDates
