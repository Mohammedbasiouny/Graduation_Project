import clsx from "clsx";
import { useMediaQuery } from "@/hooks/use-media-query.hook";

const TableSkeleton = ({
  numberOfColumns = 4,
  defaultNumberOfRows = 5,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div
      role="region"
      aria-label="Loading Table Data"
      className={clsx(
        "w-full overflow-x-auto border border-(--gray-light) bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] animate-pulse",
        "rounded-[10px]"
      )}
    >
      {/* Desktop Table Skeleton */}
      {isDesktop ? (
        <table
          role="table"
          className="hidden md:table w-full border-collapse overflow-hidden"
        >
          <thead
            role="rowgroup"
            className="bg-(--gray-dark) text-white text-sm uppercase font-semibold"
          >
            <tr role="row">
              {Array.from({ length: numberOfColumns }).map((_, idx) => (
                <th
                  key={idx}
                  role="columnheader"
                  scope="col"
                  className="py-3.5 px-4.5 border-[rgba(255,255,255,0.1)]"
                >
                  <div className="h-4 w-24 bg-gray-300 rounded-md mx-auto" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup" className="divide-y divide-(--gray-light)">
            {Array.from({ length: defaultNumberOfRows }).map((_, rowIdx) => (
              <tr
                key={rowIdx}
                role="row"
                className="even:bg-(--gray-light)/20 odd:bg-white"
              >
                {Array.from({ length: numberOfColumns }).map((_, colIdx) => (
                  <td
                    key={colIdx}
                    role="cell"
                    className="py-4 px-4.5 text-[15px]"
                  >
                    <div className="h-4 w-full bg-gray-300 rounded-md" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Mobile Skeleton View (List)
        <div
          role="list"
          aria-label="Loading List Data"
          className="md:hidden flex flex-col divide-y divide-(--gray-light)"
        >
          {Array.from({ length: defaultNumberOfRows }).map((_, idx) => (
            <div
              key={idx}
              role="listitem"
              className="p-4 flex flex-col gap-2 bg-white"
            >
              {/* Simulate "main" and "sub" lines like your TData mobile view */}
              <div className="h-4 w-3/4 bg-gray-300 rounded-md" />
              {Array.from({ length: numberOfColumns - 1 }).map((__, subIdx) => (
                <div
                  key={subIdx}
                  className="h-4 w-1/2 bg-gray-200 rounded-md"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;
