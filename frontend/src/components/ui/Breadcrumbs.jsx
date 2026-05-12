import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { translateNumber } from "@/i18n/utils";
import { useLanguage } from "@/i18n/use-language.hook";

function Breadcrumbs() {
  const { t } = useTranslation();
  const { currentLang, isArabic } = useLanguage();
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x !== "");

    const translateSegment = (segment) => {
      if (!isNaN(segment)) {
        return translateNumber(segment, currentLang, false);
      }
    
      const translated = t(`routes:${segment}`);
      // If translation is an object, return the title, otherwise return the string
      return typeof translated === "object" && translated !== null
        ? translated.title
        : translated;
    };
    

  return (
    <div className="py-2 text-sm font-medium w-full overflow-x-auto scrollbar-hide">
      <ol className={`flex items-center space-x-2`}>
        {/* Home */}
        <li className="flex items-center">
          <Link
            to="/"
            className="px-3 py-1 rounded-md shadow hover:shadow-lg bg-white whitespace-nowrap text-blue-600 hover:underline"
          >
            {t(`routes:home`)}
          </Link>
        </li>

        {/* Dynamic segments */}
        {pathnames.map((segment, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              <span className="mx-1 whitespace-nowrap">{isArabic ? "\\" : "/"}</span>

              {/* Segment */}
              {isLast || !isNaN(segment) ? (
                <span className="px-3 py-1 rounded-md shadow bg-gray-100 text-gray-500 capitalize whitespace-nowrap">
                  {translateSegment(segment)}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="px-3 py-1 rounded-md shadow hover:shadow-lg bg-white text-blue-600 hover:underline capitalize whitespace-nowrap"
                >
                  {translateSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Breadcrumbs;
