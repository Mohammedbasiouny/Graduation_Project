import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button, IconButton } from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';

const ActionButtons = ({ row }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        size='xs'
        onClick={() => openModal("edit-schedule", { id: row.id })}
      >
        {t("meals-schedule:click_to_edit_schedule")}
      </Button>

      <Button
        size='xs'
        onClick={() => openModal("edit-slots", { id: row.id })}
      >
        {t("meals-schedule:click_to_edit_meals")}
      </Button>

      <Tooltip content={t("buttons:delete")}>
        <IconButton
          icon={Trash2}
          onClick={() => openModal("delete", { id: row.id })}
          className="text-red-600 bg-red-50 rounded-md p-1"
        />
      </Tooltip>
    </div>
  )
}

export default ActionButtons
