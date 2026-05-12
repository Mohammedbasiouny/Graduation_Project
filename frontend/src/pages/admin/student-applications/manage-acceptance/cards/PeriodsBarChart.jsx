import { BarChart } from '@mui/x-charts';
import React from 'react'
import { useTranslation } from 'react-i18next';

const PeriodsBarChart = ({ chartLabels, applicationsData, completedData }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
      <h3 className="font-semibold mb-2">
        {t("manage-acceptance:charts.application_periods.title")}
      </h3>

      <p className="text-xs text-gray-500 mb-3">
        {t("manage-acceptance:charts.application_periods.description")}
      </p>

      <BarChart
        className='rtl:font-ar ltr:font-en'
        xAxis={[
          {
            scaleType: 'band',
            data: chartLabels,
            barGapRatio: 0.1
          }
        ]}
        series={[
          {
            data: applicationsData,
            label: t("manage-acceptance:columns.applications_count"),
            color: "#9F0712"
          },
          {
            data: completedData,
            label: t("manage-acceptance:columns.completed_applications_count"),
            color: "#016630"
          },
        ]}
        height={200}
      />
    </div>
  )
}

export default PeriodsBarChart