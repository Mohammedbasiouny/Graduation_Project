import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { translateNumber } from "@/i18n/utils";
import { BriefcaseMedical, User, UserStar, Utensils, Wrench, UserCheck } from "lucide-react";

const AccountsRoleCountCard = ({
  statistics = {
    admin: 0,
    maintenance: 0,
    student: 0,
    medical: 0,
    cafeteria: 0,
    supervisor: 0
  },
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();

  const { admin, maintenance, student, medical, cafeteria, supervisor } = statistics;

  const roles = [
    { label: t("fields:role.options.admin"), count: admin, icon: <UserStar className="w-5 h-5 text-blue-600" />, color: "blue" },
    { label: t("fields:role.options.student"), count: student, icon: <User className="w-5 h-5 text-green-600" />, color: "green" },
    { label: t("fields:role.options.maintenance"), count: maintenance, icon: <Wrench className="w-5 h-5 text-yellow-600" />, color: "yellow" },
    { label: t("fields:role.options.cafeteria"), count: cafeteria, icon: <Utensils className="w-5 h-5 text-orange-600" />, color: "orange" },
    { label: t("fields:role.options.medical"), count: medical, icon: <BriefcaseMedical className="w-5 h-5 text-red-600" />, color: "red" },
    { label: t("fields:role.options.supervisor"), count: supervisor, icon: <UserCheck className="w-5 h-5 text-gray-600" />, color: "gray" },
  ];

  return (
    <div
      className={clsx(
        "w-full rounded-2xl border border-(--gray-light) bg-white shadow-md p-5 flex flex-col gap-4",
        className
      )}
      {...rest}
    >
      {/* Title */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-(--primary-dark)">
            {t("account:overview.roles_count.title")}
          </p>
          <p className="text-sm text-(--text-muted)">
            {t("account:overview.roles_count.subtitle")}
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="flex flex-wrap justify-center gap-4">
        {roles.map((role, idx) => (
          <div
            key={idx}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md bg-white cursor-pointer",
              "min-w-35 max-w-50 flex-1"
            )}
          >
            {/* Icon */}
            <div
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-xl",
                `bg-${role.color}-100`
              )}
            >
              {role.icon}
            </div>

            {/* Text */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-gray-500 truncate">{role.label}</span>
              <span className="text-md font-bold text-gray-800">
                {role.count === 0 ? t("zero") : translateNumber(role.count)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsRoleCountCard;

