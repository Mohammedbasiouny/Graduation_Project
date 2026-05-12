import { Button } from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TData, TRow } from '@/components/ui/Table';
import useCollapsible from '@/hooks/use-collapsible.hook';
import { translateDate, translateNumber, translateTime } from '@/i18n/utils';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { limitWords } from '@/utils/format-text.utils';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import ActionButtons from './ActionButtons';
import StatisticsRow from './StatisticsRow';

const AcceptanceRow = ({ row, columns }) => {
  const { t } = useTranslation();
  const { collapsed, toggle, contentRef, maxHeight } = useCollapsible(true);

  const {
    id,
    name,
    studentType,
    startAt,
    endAt,
    applications,
    completed_male,
    completed_female,
    security_accepted,
    candidates_for_final_acceptanced,
    new_total_eg, 
    new_completed_eg, 
    old_total_eg, 
    old_completed_eg,
    new_total_ex, 
    new_completed_ex, 
    old_total_ex, 
    old_completed_ex,
    preliminaryResultAnnounced,
  } = row;

  const start = `${translateDate(formatToDateOnly(startAt))}\n${translateTime(formatToTimeOnly(startAt))}`;
  const end = `${translateDate(formatToDateOnly(endAt))}\n${translateTime(formatToTimeOnly(endAt))}`;
  const studentTypeLabel = t(`fields:student_type.options.${studentType}`);

  const isPeriodEnded = new Date() >= new Date(endAt);

  return (
    <>
      {/* MAIN ROW */}
      <TRow>
        <TData isMain column={columns[0]}>
          {translateNumber(id)}
        </TData>

        <TData isMain column={columns[1]}>
          {limitWords(name)}
        </TData>

        <TData isMain column={columns[2]}>
          {studentTypeLabel}
        </TData>

        <TData column={columns[3]} className="text-center">
          <span className="font-semibold text-sm whitespace-pre-line">
            {start}
          </span>
        </TData>

        <TData column={columns[4]} className="text-center">
          <span className="font-semibold text-sm whitespace-pre-line">
            {end}
          </span>
        </TData>

        <TData column={columns[5]} className="text-center">
          <span className="font-semibold text-lg">
            {applications === 0 ? t("NA") : translateNumber(applications)}
          </span>
        </TData>

        <TData column={columns[6]} className="text-center">
          <span className="font-semibold text-lg">
            {completed_male == 0 && completed_female ==0 ? t("NA") : translateNumber(completed_male + completed_female)}
          </span>
        </TData>

        <TData column={columns[7]} className="text-center">
          <span className="font-semibold text-lg">
            {security_accepted === 0 ? t("NA") : translateNumber(security_accepted)}
          </span>
        </TData>

        <TData column={columns[8]} className="text-center">
          <span className="font-semibold text-lg">
            {candidates_for_final_acceptanced === 0 ? t("NA") : translateNumber(candidates_for_final_acceptanced)}
          </span>
        </TData>

        <TData column={columns[9]} className="text-center">
          <Button
            fullWidth
            size='xs'
            onClick={toggle}
            icon={collapsed ? <ChevronDown /> : <ChevronUp />}
          >
            {collapsed
              ? t("manage-acceptance:buttons.show_actions")
              : t("manage-acceptance:buttons.hide_actions")}
          </Button>
        </TData>
      </TRow>
      {/* COLLAPSIBLE FULL WIDTH ROW */}
      <tr className='border-b-[1.5px] border-b-gray-600'>
        <td colSpan={columns.length}>
          <div
            ref={contentRef}
            style={{ maxHeight }}
            className="overflow-hidden transition-all duration-300 ease-in-out w-full"
          >
            <div className="px-6 py-4 bg-white">
              {/* header */}
              <div className="flex items-center justify-between mb-3">
                <Heading size='xs' align='start' title={t("manage-acceptance:stats.section_title")} />

                <StatusBadge size={"small"} variant={!isPeriodEnded ? "warning" : "success"}>
                  {!isPeriodEnded ? t("manage-acceptance:period_not_ended") : t("manage-acceptance:period_ended")}
                </StatusBadge>
              </div>

              <StatisticsRow 
                data={ 
                  {
                    studentType,
                    completed_male,
                    completed_female,
                    new_total_eg, 
                    new_completed_eg, 
                    old_total_eg, 
                    old_completed_eg,
                    new_total_ex, 
                    new_completed_ex, 
                    old_total_ex, 
                    old_completed_ex
                  }
                } 
              />

              <ActionButtons isPeriodEnded={isPeriodEnded} data={{ id, preliminaryResultAnnounced }} />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default AcceptanceRow