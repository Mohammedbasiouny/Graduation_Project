import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { translateNumber } from "@/i18n/utils";
import {
  FileText,
  CheckCircle,
  ShieldCheck,
  Award,
  Percent,
  Users,
} from "lucide-react";

const AcceptanceStatisticsCard = ({
  statistics = {
    applications: 0,
    completed: 0,
    security: 0,
    candidates: 0,
  },
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();

  const {
    applications,
    completed,
    security,
    candidates,
  } = statistics;

  const completionRate = applications
    ? Math.round((completed / applications) * 100)
    : 0;

  const items = [
    {
      label: t("manage-acceptance:stats.applications"),
      count: applications,
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      color: "blue",
    },
    {
      label: t("manage-acceptance:stats.completed"),
      count: completed,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      color: "green",
    },
    {
      label: t("manage-acceptance:stats.completion_rate"),
      count: `${completionRate}%`,
      icon: <Percent className="w-5 h-5 text-indigo-600" />,
      color: "indigo",
    },
    {
      label: t("manage-acceptance:stats.security"),
      count: security,
      icon: <ShieldCheck className="w-5 h-5 text-yellow-600" />,
      color: "yellow",
    },
    {
      label: t("manage-acceptance:stats.candidates"),
      count: candidates,
      icon: <Users className="w-5 h-5 text-orange-600" />,
      color: "orange",
    },
  ];

  return (
    <div
      className={clsx(
        "w-full rounded-2xl border border-(--gray-light) bg-white shadow-md p-5 flex flex-col gap-4",
        className
      )}
      {...rest}
    >
      {/* Header */}
      <div className="flex flex-col">
        <p className="text-lg font-semibold text-(--primary-dark)">
          {t("manage-acceptance:stats.title")}
        </p>
        <p className="text-sm text-(--text-muted)">
          {t("manage-acceptance:stats.subtitle")}
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md bg-white",
              "min-w-40 max-w-fit flex-1"
            )}
          >
            <div
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-xl",
                `bg-${item.color}-100`
              )}
            >
              {item.icon}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm text-gray-500 truncate">
                {item.label}
              </span>
              <span className="text-md font-bold text-gray-800">
                {item.count === 0 ? t("zero") : translateNumber(item.count)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptanceStatisticsCard;