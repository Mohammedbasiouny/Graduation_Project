import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const SortableItem = ({ id }) => {
  const { t } = useTranslation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "flex justify-between items-center gap-4 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition",
        "relative group ",
        "backdrop-blur-sm",
        "shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-sm hover:border-gray-300",
        "mx-2 overflow-hidden",
        isDragging &&
          "z-50 shadow-2xl scale-[1.01] border-(--gold-main) ring-2 ring-(--gold-main)"
      )}
    >
      {/* Soft left accent bar */}
      <div
        className={clsx(
          "absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-all duration-300",
          isDragging
            ? "bg-primary"
            : "bg-transparent group-hover:bg-gray-200"
        )}
      />

      {/* Content */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className={clsx(
            "flex items-center justify-center",
            "rounded-lg p-2",
            "cursor-grab active:cursor-grabbing",
            "transition-all duration-200",
            "text-gray-400",
            "hover:bg-gray-100 hover:text-gray-600",
            isDragging && "text-primary bg-primary/10"
          )}
        >
          <GripVertical size={18} />
        </button>

        {/* Field Label */}
        <span
          className={clsx(
            "text-sm font-semibold tracking-tight",
            "transition-colors duration-200",
            isDragging ? "text-(--primary-dark)" : "text-gray-800"
          )}
        >
          {t(`manage-students-files:fields_labels.${id}`, id)}
        </span>
      </div>

      {/* Dragging Indicator */}
      <div
        className={clsx(
          "text-xs font-medium px-2 py-1 rounded-full",
          "transition-all duration-300",
          isDragging
            ? "opacity-100 bg-primary/10 text-primary"
            : "opacity-0 group-hover:opacity-100 bg-gray-100 text-gray-500"
        )}
      >
        {isDragging
          ? t("manage-students-files:messages.moving")
          : t("manage-students-files:messages.drag")}
      </div>
    </div>
  );
};

export default SortableItem;