import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableSkeleton, TData, TRow } from "@/components/ui/Table";
import { translateDate, translateNumber, translateTime } from "@/i18n/utils";
import { truncateText } from "@/utils/format-text.utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ActionButtons from "./ActionButtons";
import { formatToDateOnly, formatToTimeOnly } from "@/utils/format-date-and-time.utils";
import { getMealScheduleStatus } from "@/utils/meal-schedule-status.utils";

const MealsScheduleTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("meals-schedule:table.columns.day_type"),
      t("meals-schedule:table.columns.meals_count"),
      t("meals-schedule:table.columns.status"),
      t("meals-schedule:table.columns.booking_start_time"),
      t("meals-schedule:table.columns.booking_end_time"),
      t("meals-schedule:table.columns.actions"),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={5} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(({ id, slots_count, day_type, booking_start_time, booking_end_time }) => {
        const dayTypeName = t(`fields:day_type.options.${day_type}`);
        const mealStatus = getMealScheduleStatus({ booking_start_time, booking_end_time });
        const formatedStartDate = `${translateDate(formatToDateOnly(booking_start_time))} - ${translateTime(formatToTimeOnly(booking_start_time))}`;
        const formatedEndDate = `${translateDate(formatToDateOnly(booking_end_time))} - ${translateTime(formatToTimeOnly(booking_end_time))}`;
        return (<TRow key={id}>
          <TData 
            column={columns[2]} 
            className='whitespace-pre-line'
          >
            {dayTypeName}
          </TData>
          <TData column={columns[0]}>
            {slots_count == 0 ? t("zero") : translateNumber(slots_count)}
          </TData>
          <TData column={columns[1]}>
            <StatusBadge size={"small"} variant={mealStatus.variant}>
              {mealStatus.status}
            </StatusBadge>
          </TData>
          <TData column={columns[3]}>
            {formatedStartDate}
          </TData>

          <TData column={columns[4]}>
            {formatedEndDate}
          </TData>

          {/* Actions */}
          <TData column={columns[5]} className='block'>
            <ActionButtons row={{ id }} />
          </TData>
        </TRow>)
      })}
    </Table>
  )
}

export default MealsScheduleTable
