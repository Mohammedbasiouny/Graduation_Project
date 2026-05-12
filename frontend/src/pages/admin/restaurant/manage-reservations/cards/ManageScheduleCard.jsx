import { ActionCard } from '@/components/ui/ActionCard';
import { Button } from '@/components/ui/Button';
import { ClipboardClock } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

const ManageScheduleCard = () => {
  const { t } = useTranslation();

  return (
    <ActionCard
      title={t("restaurant:cards.manage_meals_schedule.title")}
      description={t("restaurant:cards.manage_meals_schedule.description")}
      icon={ClipboardClock}
    >
      <NavLink to={"/admin/restaurant/manage-meals-schedule"} className={"w-full"}>
        <Button
          variant="secondary"
          size="md"
          fullWidth
        >
          {t("restaurant:cards.manage_meals_schedule.button")}
        </Button>
      </NavLink>
    </ActionCard>
  )
}

export default ManageScheduleCard
