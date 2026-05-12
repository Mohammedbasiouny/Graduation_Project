import { useMediaQuery } from "@/hooks/use-media-query.hook";
import { TextSearch } from "lucide-react";
import THead from "./THead";
import EmptyData from "./EmptyData";

const Table = ({ columns = [], children = null, isEmpty = false, emptyMessage}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div
      role="region"
      aria-label="Data Table"
      className="w-full overflow-x-auto rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-(--gray-light) bg-white"
    >
      {isDesktop ? (
        <table
          role="table"
          className="hidden md:table w-full border-collapse overflow-hidden rounded-[10px]"
        >
          <THead columns={columns} />
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className=" py-10 text-(--primary-dark)/70"
                >
                  <EmptyData emptyMessage={emptyMessage} />
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      ) : (
        <div
          role="list"
          className="md:hidden flex flex-col divide-y divide-(--gray-light)"
        >
          {isEmpty ? (
            <div
              className="p-7.5 text-(--primary-dark)/70 flex flex-col items-center gap-3"
              aria-label="Empty Data Message"
            >
              <TextSearch size={30} />
              <p className="text-center text-[15px] ">{emptyMessage}</p>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export default Table;
