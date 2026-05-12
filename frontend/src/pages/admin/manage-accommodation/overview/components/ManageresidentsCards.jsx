import IconCard from '@/components/ui/IconCard'
import {
  UserRound,
  ScanFace,
  UtensilsCrossed,
  UsersRound,
  Wrench,
  CreditCard,
  MessageSquareWarning,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router';

const ManageresidentsCards = () => {
  const { t } = useTranslation();

  return (
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>

  <NavLink
    to={"/admin/residents/view-all"}
    className="flex h-full"
  >
    <IconCard
      className="flex-1"
      icon={UserRound}
      title={t("manage-residents:action_cards.view.title")}
      subtitle={t("manage-residents:action_cards.view.subtitle")}
    />
  </NavLink>

  <NavLink
    to={"/admin/residents/attendance-statistics"}
    className="flex h-full"
  >
    <IconCard
      className="flex-1"
      icon={ScanFace}
      title={t("manage-residents:action_cards.attendance.title")}
      subtitle={t("manage-residents:action_cards.attendance.subtitle")}
    />
  </NavLink>

  <div className="flex">
    <IconCard
      className="flex-1"
      icon={UtensilsCrossed}
      title={t("manage-residents:action_cards.meals_reservations.title")}
      subtitle={t("manage-residents:action_cards.meals_reservations.subtitle")}
    />
  </div>

  <div className="flex">
    <IconCard
      className="flex-1"
      icon={UsersRound}
      title={t("manage-residents:action_cards.visiting.title")}
      subtitle={t("manage-residents:action_cards.visiting.subtitle")}
    />
  </div>

  <div className="flex">
    <IconCard
      className="flex-1"
      icon={Wrench}
      title={t("manage-residents:action_cards.maintenance.title")}
      subtitle={t("manage-residents:action_cards.maintenance.subtitle")}
    />
  </div>

  <div className="flex">
    <IconCard
      className="flex-1"
      icon={CreditCard}
      title={t("manage-residents:action_cards.fees.title")}
      subtitle={t("manage-residents:action_cards.fees.subtitle")}
    />
  </div>

  <div className="flex">
    <IconCard
      className="flex-1"
      icon={MessageSquareWarning}
      title={t("manage-residents:action_cards.complaints.title")}
      subtitle={t("manage-residents:action_cards.complaints.subtitle")}
    />
  </div>

</div>
  )
}

export default ManageresidentsCards