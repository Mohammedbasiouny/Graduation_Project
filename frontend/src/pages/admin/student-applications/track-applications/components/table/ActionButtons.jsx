import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

const ActionButtons = ({ row }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-3">
    <Tooltip content={t("buttons:view")}>
      <NavLink to={`/admin/applications/${row.id}`}>
        <Button
          size='sm'
        >
          {t("manage-student-applications:actions.view_details")}
        </Button>
      </NavLink>
    </Tooltip>
  </div>
  )
}

export default ActionButtons
