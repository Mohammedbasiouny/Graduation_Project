import Heading from '@/components/ui/Heading';
import { BarChart } from '@mui/x-charts';
import React from 'react'
import { useTranslation } from 'react-i18next';

const BuildingsAttendanceBarChart = ({ height = 300 }) => {
  const { t } = useTranslation();

  const buildings = [
          { name: "Building A", total_students: 120, checked_in: 95 },
          { name: "Building B", total_students: 80, checked_in: 60 },
          { name: "Building C", total_students: 150, checked_in: 130 },
          { name: "Building D", total_students: 150, checked_in: 130 },
          { name: "Building E", total_students: 150, checked_in: 130 },
          { name: "Building F", total_students: 150, checked_in: 130 },
          { name: "Building G", total_students: 150, checked_in: 130 },
          { name: "Building H", total_students: 150, checked_in: 130 },
          { name: "Building G", total_students: 150, checked_in: 130 },
          { name: "Building U", total_students: 150, checked_in: 130 },
        ]

  const chartLabels = buildings.map((b) => b.name);
  const totalStudents = buildings.map((b) => b.total_students);
  const checkedIn = buildings.map((b) => b.checked_in);

  return (
    <div className='w-full flex flex-col gap-5'>
      <Heading
        align='start'
        size='sm'
        title={t("manage-attendance:chart_attendance_rate.title")}
        subtitle={t("manage-attendance:chart_attendance_rate.subtitle")}
      />

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        
        {/* Title */}
        <h3 className="font-semibold mb-2">
          {t("manage-attendance:charts.buildings_attendance.title")}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3">
          {t("manage-attendance:charts.buildings_attendance.description")}
        </p>

        <BarChart
          className="rtl:font-ar ltr:font-en"
          xAxis={[
            {
              scaleType: 'band',
              data: chartLabels,
              barGapRatio: 0.2
            }
          ]}
          series={[
            {
              data: totalStudents,
              label: t("manage-attendance:columns.total_students"),
              color: "#6B7280" // gray
            },
            {
              data: checkedIn,
              label: t("manage-attendance:columns.checked_in"),
              color: "#016630" // green
            },
          ]}
          height={height}
        />
      </div>
    </div>
  )
}

export default BuildingsAttendanceBarChart