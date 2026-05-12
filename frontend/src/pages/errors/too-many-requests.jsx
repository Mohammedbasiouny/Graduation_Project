import { useTranslation } from "react-i18next";
import StatusScreen from "@/components/screens/StatusScreen";
import { GaugeCircle } from 'lucide-react';
import { useLayoutStore } from '@/store/use-layout.store';
import { useEffect } from "react";

const  TooManyRequestsPage = () => {
  const { t } = useTranslation();
  const { setShowBreadcrumbs } = useLayoutStore();

  useEffect(() => {
    setShowBreadcrumbs(false)
  }, [setShowBreadcrumbs])
  
  return (
    <StatusScreen
      code="429"
      title={t("errors:429.title")}
      description={t("errors:429.description")}
      Icon={GaugeCircle}
    />
  )
}

export default TooManyRequestsPage
