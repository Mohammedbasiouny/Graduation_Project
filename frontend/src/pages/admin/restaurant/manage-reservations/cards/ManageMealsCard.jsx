import { ActionCard } from '@/components/ui/ActionCard';
import { Button } from '@/components/ui/Button';
import { Beef } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

const ManageMealsCard = () => {
  const { t } = useTranslation();

  return (
    <ActionCard
      title={t("restaurant:cards.manage_meals.title")}
      description={t("restaurant:cards.manage_meals.description")}
      icon={Beef}
    >
      <NavLink to={"/admin/restaurant/manage-meals"} className={"w-full"}>
        <Button
          variant="secondary"
          size="md"
          fullWidth
        >
          {t("restaurant:cards.manage_meals.button")}
        </Button>
      </NavLink>
    </ActionCard>
  );
}

export default ManageMealsCard
