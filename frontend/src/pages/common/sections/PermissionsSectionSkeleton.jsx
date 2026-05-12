import Heading from "@/components/ui/Heading";
import { Table, TData, TRow } from "@/components/ui/Table";

const PermissionsSectionSkeleton = () => {
  const columns = ["", ""];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 md:p-8 space-y-5 animate-pulse">
      {/* Heading */}
      <div className="space-y-2">
        <div className="h-5 w-48 bg-gray-200 rounded-md" />
        <div className="h-4 w-72 bg-gray-200 rounded-md" />
      </div>

      {/* Table */}
      <Table columns={columns}>
        {[...Array(4)].map((_, index) => (
          <TRow key={index}>
            {/* Parent */}
            <TData isMain column={columns[0]}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
              </div>
            </TData>

            {/* Children badges */}
            <TData column={columns[1]}>
              <div className="flex flex-wrap gap-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-7 w-24 bg-gray-200 rounded-full"
                  />
                ))}
              </div>
            </TData>
          </TRow>
        ))}
      </Table>

      {/* Button */}
      <div className="mt-5">
        <div className="h-10 w-44 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default PermissionsSectionSkeleton;