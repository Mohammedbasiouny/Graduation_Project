import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableItem from "./SortableItem";
import { useTranslation } from "react-i18next";

const SelectedFieldsSorter = ({ selectedFields, setSelectedFields }) => {
  const { t } = useTranslation();

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSelectedFields((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  if (!selectedFields.length) return null;

  return (
    <div className="w-full mt-6 overflow-x-hidden">
      <h3 className="font-semibold mb-3">
        {t("manage-students-files:messages.order_selected")}
      </h3>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={selectedFields}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {selectedFields.map((field) => (
              <SortableItem key={field} id={field} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SelectedFieldsSorter;