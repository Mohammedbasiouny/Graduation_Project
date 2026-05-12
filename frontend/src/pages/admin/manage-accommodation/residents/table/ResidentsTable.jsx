import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableSkeleton, TData, TRow } from "@/components/ui/Table";
import { translateNumber } from "@/i18n/utils";
import { limitWords, truncateText } from "@/utils/format-text.utils";
import { getMealActiveStatus } from "@/utils/meal-activated-status.utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ActionButtons from "./ActionButtons";
import { Check, Mars, User, Venus, X } from "lucide-react";

const ResidentsTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("manage-residents:columns.id"),
      t("manage-residents:columns.name"),
      t("manage-residents:columns.gender"),
      t("manage-residents:columns.university"),
      t("manage-residents:columns.college"),
      t("manage-residents:columns.building"),
      t("manage-residents:columns.room"),
      t("manage-residents:columns.have_face_id"),
      t('manage-residents:columns.actions'),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(({ id, full_name, gender, university, college, building, room, have_face_id }) => {
        const uniName = t(`universities.${university}`);

        return (<TRow key={id}>
          <TData column={columns[0]}>
            {translateNumber(id)}
          </TData>

          <TData isMain column={columns[1]} className='whitespace-pre-line'>
            {full_name}
          </TData>

          {/* Gender with Mars/Venus icons */}
          <TData column={columns[2]}>
            <div className="flex items-center gap-1">
              {gender === 'male' && <Mars className="w-4 h-4 text-blue-500" />}
              {gender === 'female' && <Venus className="w-4 h-4 text-pink-500" />}
              {!['male', 'female'].includes(gender) && <User className="w-4 h-4 text-gray-500" />}
              <span>{t(`gender.${gender}`)}</span>
            </div>
          </TData>

          <TData 
            column={columns[3]} 
            className='whitespace-pre-line'
          >
            {limitWords(uniName)}
          </TData>

          <TData 
            column={columns[4]} 
            className='whitespace-pre-line'
          >
            {limitWords(college)}
          </TData>

          <TData isMain column={columns[5]} className='whitespace-pre-line'>
            {building}
          </TData>

          <TData isMain column={columns[6]} className='whitespace-pre-line'>
            {room}
          </TData>

          <TData isMain column={columns[7]}>
            <div className="flex items-center justify-center">
              {have_face_id ? (
                <Check className="text-green-600" />
              ) : (
                <X className="text-red-600" />
              )}
            </div>
          </TData>

          {/* Actions */}
          <TData column={columns[8]} className='block'>
            <ActionButtons row={{ id }} />
          </TData>
        </TRow>)
      })}
    </Table>
  )
}

export default ResidentsTable
