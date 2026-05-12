import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableSkeleton, TData, TRow } from "@/components/ui/Table";
import { translateNumber } from "@/i18n/utils";
import { truncateText } from "@/utils/format-text.utils";
import { getMealActiveStatus } from "@/utils/meal-activated-status.utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ActionButtons from "./ActionButtons";

const MealsTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("meals:table.columns.id"),
      t("meals:table.columns.name"),
      t("meals:table.columns.category"),
      t("meals:table.columns.is_active"),
      t('meals:table.columns.actions'),
    ],
    [t]
  );

  if (isLoading) {
    return <TableSkeleton numberOfColumns={5} defaultNumberOfRows={5} />;
  }

  return (
    <Table columns={columns} isEmpty={rows.length === 0}>
      {rows.map(({ id, name, category, is_active }) => {
        const categoryName = t(`fields:meal_category.options.${category}`);
        const { label, variant } = getMealActiveStatus(is_active);

        return (<TRow key={id}>
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
            {categoryName}
          </TData>
          <TData column={columns[3]}>
            <StatusBadge variant={variant} size="small">
              {label}
            </StatusBadge>
          </TData>

          {/* Actions */}
          <TData column={columns[4]} className='block'>
            <ActionButtons row={{ id }} />
          </TData>
        </TRow>)
      })}
    </Table>
  )
}

export default MealsTable
