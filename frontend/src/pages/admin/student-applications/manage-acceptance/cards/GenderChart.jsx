import { PieChart } from '@mui/x-charts'
import React from 'react'
import { useTranslation } from 'react-i18next';

const GenderChart = ({ malesCount, femalesCount }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
      <h3 className="font-semibold mb-2">
        {t("manage-acceptance:charts.gender.title")}
      </h3>

      <p className="text-xs text-gray-500 mb-3">
        {t("manage-acceptance:charts.gender.description")}
      </p>

      <PieChart
        className='rtl:font-ar ltr:font-en'
        series={[
          {
            data: [
              {
                id: 0,
                value: malesCount,
                label: t("manage-acceptance:males"),
                color: "oklch(54.6% 0.245 262.881)"
              },
              {
                id: 1,
                value: femalesCount,
                label: t("manage-acceptance:females"),
                color: "oklch(59.2% 0.249 0.584)"
              },
            ],
          },
        ]}
        height={200}
      />
    </div>
  )
}

export default GenderChart