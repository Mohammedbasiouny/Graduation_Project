import { Eye, Pencil, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { useModalStoreV2 } from '@/store/use.modal.store';

const ActionButtons = ({ row }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStoreV2();

  return (
    <div className="flex items-center justify-center gap-3">
    <Tooltip content={t("buttons:view")}>
      <IconButton
        icon={Eye}
        onClick={() => openModal("view-educational-department", { id: row.id })}
        className="text-gray-600 bg-gray-50 rounded-md p-1"
      />
    </Tooltip>

    <Tooltip content={t("buttons:edit")}>
      <IconButton
        icon={Pencil}
        onClick={() => openModal("edit-educational-department", { id: row.id })}
        className="text-blue-600 bg-blue-50 rounded-md p-1"
      />
    </Tooltip>

    <Tooltip content={t("buttons:delete")}>
      <IconButton
        icon={Trash2}
        onClick={() => openModal("delete-educational-department", { id: row.id })}
        className="text-red-600 bg-red-50 rounded-md p-1"
      />
    </Tooltip>
  </div>
  )
}

export default ActionButtons
