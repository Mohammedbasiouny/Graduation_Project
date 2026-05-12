import { ShowingItems, ShowingItemsSkeleton } from "./ShowingItems";
import PageSizeSelect from "./PageSizeSelect";
import { PageNumbers, PageNumbersSkeleton } from "./PageNumbers";
import { PaginatorButtons, PaginatorButtonsSkeleton } from "./PaginatorButtons";
import { Button } from "../Button";
import { useTranslation } from "react-i18next";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";

const Pagination = ({ pagination, isLoading = false, pageName = "page", pageSizeName = "page_size", withPaginationName = "with_pagination" }) => {
  const { t } = useTranslation();
  const { getParam, setParam } = useURLSearchParams();
  
  const handleWithPaginationBtn = () => {
    const current = getParam(withPaginationName) !== "false";
    setParam(withPaginationName, !current);
  };

  if (isLoading) return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-2 mt-2">
      <PageNumbersSkeleton />
      <div className='flex flex-wrap items-center gap-3'>
        <ShowingItemsSkeleton />
      </div>
      <PaginatorButtonsSkeleton />
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-2 mt-2">
      <PageNumbers
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        name={pageName}
      />
      <div className="flex flex-col items-center gap-3">
        <div className='flex flex-wrap items-center gap-3'>
          <ShowingItems
            page={pagination.page}
            page_size={pagination.page_size}
            total_items={pagination.total_items}
          />
          <PageSizeSelect 
            pageSize={pagination.page_size} 
            name={pageSizeName}
          />
        </div>

        <Button size="xs" variant={`${getParam(withPaginationName) !== "false" ? "secondary" : "error"}`} onClick={handleWithPaginationBtn}>
          {t(`with_pagination_btn.${getParam(withPaginationName) !== "false" ? "true" : "false"}`)}
        </Button>

      </div>
      <PaginatorButtons
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        name={pageName}
      />
    </div>
  );
};

export default Pagination;
