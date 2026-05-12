import { translateNumber } from "@/i18n/utils";
import { useLanguage } from "@/i18n/use-language.hook";

const ShowingItems = ({ page, page_size, total_items }) => {
  const { currentLang, i18n } = useLanguage();

  const startItem = total_items === 0 ? 0 : (page - 1) * page_size + 1;
  const endItem = Math.min(page * page_size, total_items);

  return (
    <div className="text-gray-700 text-base md:text-lg font-bold">
      {total_items === 0
        ? i18n.t("pagination.no_items_found")
        : `${translateNumber(startItem, currentLang)}–${translateNumber(
            endItem,
            currentLang
          )} ${i18n.t("pagination.of")} ${translateNumber(total_items, currentLang)} ${i18n.t("pagination.items")}`}
    </div>
  );
};

export default ShowingItems;
