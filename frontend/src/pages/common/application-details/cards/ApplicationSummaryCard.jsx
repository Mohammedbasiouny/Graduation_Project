import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { translateDate, translateNumber, translateTime } from "@/i18n/utils";
import { useModalStoreV2 } from "@/store/use.modal.store";
import { formatToDateOnly, formatToTimeOnly } from "@/utils/format-date-and-time.utils";
import { useAuthStore } from "@/store/use-auth.store";

const ApplicationSummaryCard = ({ student }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();
  const { user } = useAuthStore();

  if (!student) return null;

  return (
    <div className="h-fit bg-white rounded-2xl shadow-md p-5 space-y-5 transition">
      
      {/* Summary Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t("track-application:summrize.id")}</span>
          <span className="font-medium text-gray-900">{translateNumber(student.id)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t("track-application:summrize.is_egyptian_national")}</span>
          <span className="font-medium text-gray-900">
            {student.is_egyptian_national ? t("egyptian.title") : t("expatriate.title")}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t("track-application:summrize.is_resident_inside_egypt")}</span>
          <span className="font-medium text-gray-900">
            {student.is_resident_inside_egypt === null ? t("NA") : (
              <span className="font-medium text-gray-900">
                {student.is_resident_inside_egypt ? t("resident_in_egypt.title") : t("resident_outside_egypt.title")}
              </span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t("track-application:summrize.is_new_student")}</span>
          {student.is_new_student === null ? t("NA") : (
            <span className="font-medium text-gray-900">
              {student.is_new_student ? t("new_student.title") : t("existing_student.title")}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t("track-application:summrize.created_at")}</span>
          <div className="space-x-2">
            <span className="font-medium text-gray-900">{translateDate(formatToDateOnly(student.applied_at))}</span>
            <span className="font-medium text-gray-500">|</span>
            <span className="font-medium text-gray-900">{translateTime(formatToTimeOnly(student.applied_at))}</span>
          </div>
        </div>
      </div>


      {user?.role === "student" && (
        <>
          {/* Divider */}
          <div className="border-t" />

          {/* Delete Button */}
          <div className="w-full flex items-center justify-center">
            <Button 
              size="sm"
              variant="danger"
              onClick={() => openModal("delete-application")}
            >
              {t("track-application:delete_application")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationSummaryCard;