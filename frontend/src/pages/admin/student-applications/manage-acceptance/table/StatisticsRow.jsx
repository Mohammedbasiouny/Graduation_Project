import { translateNumber } from '@/i18n/utils'
import React from 'react'
import { useTranslation } from 'react-i18next';
import GenderSummary from './GenderSummary';

const StatisticsRow = ({ data }) => {
  const { t } = useTranslation();

  const {
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
    old_completed_ex,
  } = data;

  const renderRow = (label, total, completed) => (
    <div className="flex gap-1 items-center text-base">
      <span className="font-bold text-gray-800">
        {t(label)}
      </span>
      <span className="font-medium text-gray-900">
        {t("manage-acceptance:stats.comparison", {
          total: translateNumber(total),
          completed: translateNumber(completed),
        })}
      </span>
    </div>
  );

  const renderSection = (title, newTotal, newCompleted, oldTotal, oldCompleted, className) => (
    <div className={className}>
      <p className="text-lg font-semibold text-gray-700">
        {t(title)}
      </p>

      {["all", "new"].includes(studentType) &&
        renderRow(
          "manage-acceptance:stats.new_students",
          newTotal,
          newCompleted
        )}

      {["all", "old"].includes(studentType) &&
        renderRow(
          "manage-acceptance:stats.old_students",
          oldTotal,
          oldCompleted
        )}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-5">
      <GenderSummary
        male={completed_male}
        female={completed_female}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x-2 divide-gray-300 gap-5 md:gap-0 w-full">
        
        {renderSection(
          "manage-acceptance:stats.eg_title",
          new_total_eg,
          new_completed_eg,
          old_total_eg,
          old_completed_eg,
          "md:pe-6 space-y-3"
        )}

        {renderSection(
          "manage-acceptance:stats.ex_title",
          new_total_ex,
          new_completed_ex,
          old_total_ex,
          old_completed_ex,
          "md:ps-6 space-y-3"
        )}

      </div>
    </div>
  );
};

export default StatisticsRow;