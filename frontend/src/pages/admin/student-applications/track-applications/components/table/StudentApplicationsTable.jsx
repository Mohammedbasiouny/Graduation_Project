import { translateDate, translateNumber, translateTime } from '@/i18n/utils';
import { useTranslation } from 'react-i18next';
import { TData, TRow, Table, TableSkeleton } from '@/components/ui/Table';
import ActionButtons from './ActionButtons';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { Mars, Venus, User } from 'lucide-react'; // <-- import icons
import { useMemo } from 'react';

const StudentApplicationsTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("manage-student-applications:table.columns.id"),
      t("manage-student-applications:table.columns.full_name"),
      t("manage-student-applications:table.columns.gender"),
      t("manage-student-applications:table.columns.is_egyptian_national"),
      t("manage-student-applications:table.columns.is_resident_inside_egypt"),
      t("manage-student-applications:table.columns.is_new_student"),
      t("manage-student-applications:table.columns.dorm_type"),
      t("manage-student-applications:table.columns.is_completed"),
      t("manage-student-applications:table.columns.created_at"),
      t("manage-student-applications:table.columns.actions"),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows?.length === 0}>
      {rows.map((row) => {
        return (
          <TRow key={row.id}>
            <TData column={columns[0]}>
              {translateNumber(row.id)}
            </TData>

            <TData isMain column={columns[1]} className='whitespace-pre-line'>
              {row.full_name}
            </TData>

            {/* Gender with Mars/Venus icons */}
            <TData column={columns[2]}>
              <div className="flex items-center gap-1">
                {row.gender === 'male' && <Mars className="w-4 h-4 text-blue-500" />}
                {row.gender === 'female' && <Venus className="w-4 h-4 text-pink-500" />}
                {!['male', 'female'].includes(row.gender) && <User className="w-4 h-4 text-gray-500" />}
                <span>{t(`gender.${row.gender}`)}</span>
              </div>
            </TData>

            <TData column={columns[3]}>
              {row.is_egyptian_national ? t("egyptian.title") : t("expatriate.title")}
            </TData>

            <TData column={columns[4]}>
              {row.is_resident_inside_egypt === null ? t("NA") : (
                row.is_resident_inside_egypt ? t("resident_in_egypt.title") : t("resident_outside_egypt.title")
              )}
            </TData>

            <TData column={columns[5]}>
              {row.is_new_student === null ? t("NA") : (
                row.is_new_student ? t("new_student.title") : t("existing_student.title")
              )}
            </TData>

            <TData column={columns[6]}>
              {row.dorm_type === null ? t("NA") : t(`manage-student-applications:room_type.${row.dorm_type}`)}
            </TData>

            <TData column={columns[7]}>
              <StatusBadge size="small" variant={row.is_completed ? "success" : "error"}>
                {t(`manage-student-applications:is_completed.${row.is_completed}`)}
              </StatusBadge>
            </TData>

            <TData column={columns[8]}>
              {translateDate(formatToDateOnly(row.applied_at))} - {translateTime(formatToTimeOnly(row.applied_at))}
            </TData>

            {/* Actions */}
            <TData column={columns[9]} className='block'>
              <ActionButtons row={row} />
            </TData>
          </TRow>
        )
      })}
    </Table>
  );
};

export default StudentApplicationsTable;