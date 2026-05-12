import { useLanguage } from "@/i18n/use-language.hook";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ⭐ icons

const PaginatorButtons = ({ currentPage, totalPages, name }) => {
  const { i18n } = useLanguage();
  const { getParam, setParam } = useURLSearchParams();

  const page = Number(getParam(name)) || currentPage || 1;
  const total_pages = totalPages || 1;

  const has_prev = page > 1;
  const has_next = page < total_pages;

  const isRTL = i18n.language === "ar";

  const handlePageChange = (p) => {
    if (p < 1 || p > total_pages) return;
    setParam(name, p);
  };

  return (
    <div className="flex justify-center gap-2 order-2 md:order-0">
      {/* Previous */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={!has_prev}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base md:text-lg font-semibold transition-colors ${
          has_prev
            ? "bg-(--gold-main) text-white hover:bg-(--gold-dark) cursor-pointer"
            : "bg-(--gray-light) text-gray-500 cursor-not-allowed"
        }`}
      >
        {/* For RTL → arrow goes right */}
        {isRTL ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
        {i18n.t("buttons:previous")}
      </button>

      {/* Next */}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={!has_next}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base md:text-lg font-semibold transition-colors ${
          has_next
            ? "bg-(--gold-main) text-white hover:bg-(--gold-dark) cursor-pointer"
            : "bg-(--gray-light) text-gray-500 cursor-not-allowed"
        }`}
      >
        {i18n.t("buttons:next")}
        {/* For RTL → arrow goes left */}
        {isRTL ? (
          <ChevronLeft size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>
    </div>
  );
};

export default PaginatorButtons;
