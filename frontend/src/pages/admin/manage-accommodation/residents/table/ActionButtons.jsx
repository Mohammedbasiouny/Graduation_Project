import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

const ActionButtons = ({ row }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-3">
      <NavLink to={`/admin/applications/${row.id}`}>
        <Button
          size='xs'
        >
          {t("manage-residents:actions.data")}
        </Button>
      </NavLink>

      <NavLink to={`/admin/residents/${row.id}/attendance`}>
        <Button
          size='xs'
        >
          {t("manage-residents:actions.attendance")}
        </Button>
      </NavLink>
    </div>
  )
}

export default ActionButtons
