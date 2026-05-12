import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import AcceptanceRow from './AcceptanceRow';
import { Table, TableSkeleton } from '@/components/ui/Table';

const PeriodsTable = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      t("manage-acceptance:columns.id"),
      t("manage-acceptance:columns.application_periods"),
      t("manage-acceptance:columns.student_type"),
      t("manage-acceptance:columns.start_at"),
      t("manage-acceptance:columns.end_at"),
      t("manage-acceptance:columns.applications_count"),
      t("manage-acceptance:columns.completed_applications_count"),
      t("manage-acceptance:columns.accepted_security_count"),
      t("manage-acceptance:columns.candidates_for_final_acceptance"),
      t("manage-acceptance:columns.actions"),
    ],
    [t]
  );


  if (isLoading) {
    return <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />;
  }

  return (
    <>
      <Table columns={columns} isEmpty={rows.length === 0}>
        {rows.map((row) => (
          <AcceptanceRow
            key={row.id}
            row={row}
            columns={columns}
          />
        ))}
      </Table>
    </>
  )
}

export default PeriodsTable