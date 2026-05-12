import Heading from "@/components/ui/Heading";
import { useTranslation } from "react-i18next";
import BigCalendarStatistics from "./tabs/BigCalendarStatistics";
import BuildingsAttendanceBarChart from "./tabs/BuildingsAttendanceBarChart";
import { useMemo, useState } from "react";
import Tabs from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { translateTime } from "@/i18n/utils";
import { useModalStoreV2 } from "@/store/use.modal.store";
import AttendanceByFaceIdModal from "./popup/AttendanceByFaceIdModal";
import { NavLink } from "react-router";

const AttendanceStatisticsPage = () => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  const [activeTab, setActiveTab] = useState("calendar");

  /** --- Tabs Definition --- */
  const tabs = useMemo(() => [
    { text: t("manage-attendance:tabs.calendar"), key: "calendar" },
    { text: t("manage-attendance:tabs.buildings"), key: "buildings" },
  ], [t]);

  return (
    <div className='w-full flex flex-col gap-6 p-10 min-h-[60vh]'>

      {/* Main Heading */}
      <Heading
        title={t("manage-attendance:heading.title")}
        subtitle={t("manage-attendance:heading.subtitle")}
      />

      <div className='w-full flex items-center justify-center flex-col gap-5'>
        {/* Attendance time notice */}
        <p className="w-full text-lg font-black text-center text-red-800 tracking-wide animate-[pulseScale_1s_ease-in-out_infinite]">
          {t("manage-attendance:start_end", {
            start: translateTime("22:00"),
            end: translateTime("23:00")
          })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size='sm'
            variant='secondary'
            onClick={() => openModal("attendance-face-id")}
          >
            {t("manage-attendance:btn_check_in_by_face_id")}
          </Button>
          <NavLink to="/admin/residents/attendance/check-in">
            <Button
              size='sm'
              variant='outline'
            >
              {t("manage-attendance:btn_check_in_by_human")}
            </Button>
          </NavLink>
        </div>
      </div>

      <Tabs
        tabs={tabs.map((tab) => ({
          ...tab,
          selected: activeTab === tab.key,
          onClick: () => setActiveTab(tab.key),
        }))}
      />

      {activeTab === "calendar" && <BigCalendarStatistics />}
      {activeTab === "buildings" && <BuildingsAttendanceBarChart />}

      <AttendanceByFaceIdModal />
    </div>
  );
};

export default AttendanceStatisticsPage;