import { Button } from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ManageScheduleCard from './cards/ManageScheduleCard'
import ManageMealsCard from './cards/ManageMealsCard'
import { TodayMealCard } from '@/components/ui/cards/TodayMealCard'

const ManagementMealBookingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-md flex flex-col items-center space-y-5 border border-(--gray-lightest) p-6">
      {/* Page Header */}
      <Heading
        title={t("restaurant:main_heading.title")}
        subtitle={t("restaurant:main_heading.subtitle")}
      />
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Left Column - Today Meal */}
        <div className="w-full lg:w-2/3">
          <TodayMealCard
            meal={{
              meal_name: "Chicken & Rice",
              students_booked: 0,
              meal_description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus omnis sequi, natus laborum repudiandae iste. Iste architecto omnis aliquid ad sint asperiores cum amet, quod unde quasi corporis obcaecati non!.",
              meal_category: "lunch",
              day_type: "exam",
              delivery_start_time: "2026-02-24T22:51:47.694Z",
              delivery_end_time: "2026-02-24T22:51:47.694Z",
              booking_start_time: "2026-02-24T22:51:47.694Z",
              booking_end_time: "2026-02-24T22:51:47.694Z",
              notes: "Students must show university ID."
            }}
          />
        </div>

        {/* Right Column - Manage Cards */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <ManageMealsCard />
          <ManageScheduleCard />
        </div>
      </div>
    </div>
  )
}

export default ManagementMealBookingPage

