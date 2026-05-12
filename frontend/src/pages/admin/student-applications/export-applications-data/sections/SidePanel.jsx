import React from "react";
import { Sheet, Trash } from "lucide-react";
import SelectedFieldsSorter from "../components/SelectedFieldsSorter";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { translateNumber } from "@/i18n/utils";

const SidePanel = ({ selectedFields, setSelectedFields, onExport, isLoading = false }) => {
  const { t } = useTranslation();
  const count = selectedFields.length;

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0">
      <div
        className="
          bg-white
          rounded-2xl
          shadow-md
          p-5
          space-y-4
          border border-(--gray-light)
          relative
          lg:sticky lg:top-6 lg:max-h-[85vh] lg:overflow-y-auto
          transition-all duration-300
        "
      >
        {/* Header With Count */}
        <div className="flex items-center justify-between pb-2 border-b border-(--gray-lightest)">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            {t("manage-students-files:labels.selected_fields")}
          </h3>

          <span
            className="
              min-w-7
              h-7
              px-2
              flex
              items-center
              justify-center
              text-xs
              sm:text-sm
              font-semibold
              rounded-full
              bg-primary/10
              text-primary
              transition-all
              duration-300
            "
          >
            {count === 0 ? t('zero') : translateNumber(count)}
          </span>
        </div>

        {count === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm sm:text-base text-gray-600 text-center px-4">
            {t("manage-students-files:messages.no_fields_selected")}
          </div>
        ) : (
          <>
            <SelectedFieldsSorter
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
            />

            <div className="pt-2 space-y-2">
              <Button
                variant="success"
                icon={<Sheet size={18} />}
                onClick={onExport}
                fullWidth
                size="sm"
                isLoading={isLoading}
              >
                {isLoading ? t("buttons:isLoading") : t("manage-students-files:buttons.export")}
              </Button>

              <Button
                variant="danger"
                icon={<Trash size={18} />}
                onClick={() => setSelectedFields([])}
                fullWidth
                isLoading={isLoading}
                size="sm"
              >
                {isLoading ? t("buttons:isLoading") : t("manage-students-files:buttons.clear")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SidePanel;