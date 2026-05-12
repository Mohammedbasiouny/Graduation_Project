import { useLanguage } from '@/i18n/use-language.hook';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import { translateNumber } from '@/i18n/utils';

const PageNumbers = ({ currentPage, totalPages, name }) => {
  const { currentLang } = useLanguage();
  const { getParam, setParam } = useURLSearchParams();

  const page = Number(getParam(name)) || currentPage || 1;
  const total_pages = totalPages || 1;

  const getPageNumbers = () => {
    const pages = [];
    if (total_pages <= 7) {
      for (let i = 1; i <= total_pages; i++) pages.push(i);
    } else {
      if (page > 3) pages.push(1, 2, "...");
      else for (let i = 1; i <= 3; i++) pages.push(i);

      const start = Math.max(3, page - 1);
      const end = Math.min(total_pages - 2, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < total_pages - 2) pages.push("...", total_pages - 1, total_pages);
      else for (let i = total_pages - 2; i <= total_pages; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
    }
    return pages;
  };

  const handlePageChange = (p) => {
    if (p < 1 || p > total_pages) return;
    setParam(name, p);
  };

  return (
    <div className="flex flex-wrap justify-center gap-1 order-1 md:order-0">
      {getPageNumbers().map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 py-1 text-base md:text-lg text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-1 text-base md:text-lg font-bold cursor-pointer rounded-lg transition-colors ${
              p === page
                ? "text-white bg-(--gold-dark) hover:bg-(--gold-main)"
                : "text-gray-500 hover:text-(--gray-dark)"
            }`}
          >
            {translateNumber(p, currentLang)}
          </button>
        )
      )}
    </div>
  );
};

export default PageNumbers
