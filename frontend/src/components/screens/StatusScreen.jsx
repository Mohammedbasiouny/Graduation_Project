import clsx from "clsx";
import { translateNumber } from "@/i18n/utils";
import { useLanguage } from "@/i18n/use-language.hook";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const StatusScreen = ({ code, title, description, Icon, className = "" }) => {
  const { currentLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "flex flex-col gap-1 items-center justify-center text-center px-6 md:px-10 py-20",
        className
      )}
    >
      {/* Top section with icon + code */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        {Icon && (
          <div>
            <Icon className="w-32 h-32 text-(--primary-dark)" />
          </div>
        )}

        {/* Code */}
        {code ? (
          <h1 className="text-8xl font-extrabold text-red-600">
            {translateNumber(code, currentLang)}
          </h1>
        ): null}
      </div>

      {/* Title */}
      <h2 className="text-4xl font-semibold text-(--primary-dark)">
        {title}
      </h2>

      {/* Description */}
      <p className="max-w-md text-lg text-(--gray-dark)">{description}</p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <div>
          <Link to={"/"}>
            <Button>{t("buttons:back_to_home")}</Button>
          </Link>
        </div>

        <div onClick={() => window.location.reload()}>
          <Button variant="outline">{t("buttons:refresh_page")}</Button>
        </div>
      </div>
    </div>
  );
};

export default StatusScreen;
