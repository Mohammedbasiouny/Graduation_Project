import {
  User,
  CalendarRange,
  FileCheck,
  Utensils,
  Home,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Wrench,
  BookOpen,
  Bell,
  CreditCard,
  DoorOpen,
  ListChecks,
  FileText,
  Flag
} from "lucide-react";
import React from 'react'
import { useTranslation } from 'react-i18next';
import Heading from "@/components/ui/Heading";
import { NavLink } from "react-router";
import IconCard from "@/components/ui/IconCard";
const PortalPage = () => {
  const { t } = useTranslation();

  return (
    <div className='w-full flex flex-col items-center space-y-10 p-6 mb-10'>
      <Heading 
        title={t("portal:heading.title")}
        subtitle={t("portal:heading.subtitle")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

        <NavLink to={"/student/me"} className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={User}
            title={t("portal:cards.profile.title")}
            subtitle={t("portal:cards.profile.subtitle")}
          />
        </NavLink>

        <NavLink to={"/application-guide"} className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={FileText}
            title={t("portal:cards.application_guide.title")}
            subtitle={t("portal:cards.application_guide.subtitle")}
          />
        </NavLink>

        <NavLink to={"/student/application-dates"} className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={CalendarRange}
            title={t("portal:cards.application_dates.title")}
            subtitle={t("portal:cards.application_dates.subtitle")}
          />
        </NavLink>

        <NavLink to={"/student/track-application"} className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={ListChecks}
            title={t("portal:cards.application_status.title")}
            subtitle={t("portal:cards.application_status.subtitle")}
          />
        </NavLink>

        <NavLink to={"/student/attendance"} className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={Flag}
            title={t("portal:cards.attendance.title")}
            subtitle={t("portal:cards.attendance.subtitle")}
          />
        </NavLink>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={Utensils}
            title={t("portal:cards.meals.title")}
            subtitle={t("portal:cards.meals.subtitle")}
          />
        </div>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={Home}
            title={t("portal:cards.room_details.title")}
            subtitle={t("portal:cards.room_details.subtitle")}
          />
        </div>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={MessageSquare}
            title={t("portal:cards.complaints.title")}
            subtitle={t("portal:cards.complaints.subtitle")}
          />
        </div>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={Wrench}
            title={t("portal:cards.maintenance.title")}
            subtitle={t("portal:cards.maintenance.subtitle")}
          />
        </div>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={BookOpen}
            title={t("portal:cards.rules.title")}
            subtitle={t("portal:cards.rules.subtitle")}
          />
        </div>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={Bell}
            title={t("portal:cards.notifications.title")}
            subtitle={t("portal:cards.notifications.subtitle")}
          />
        </div>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={CreditCard}
            title={t("portal:cards.fees.title")}
            subtitle={t("portal:cards.fees.subtitle")}
          />
        </div>

        <div className="flex h-full">
          <IconCard
            className="flex-1 h-full"
            icon={DoorOpen}
            title={t("portal:cards.visit_request.title")}
            subtitle={t("portal:cards.visit_request.subtitle")}
          />
        </div>

      </div>

    </div>
  )
}

export default PortalPage
