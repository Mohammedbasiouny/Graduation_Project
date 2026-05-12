import { Bug } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatusScreen from "@/components/screens/StatusScreen";
import { useLayoutStore } from '@/store/use-layout.store';
import { useEffect } from "react";

export default function ServerPage () {
  const { t } = useTranslation();
  const { setShowBreadcrumbs } = useLayoutStore();

  useEffect(() => {
    setShowBreadcrumbs(false)
  }, [setShowBreadcrumbs])
  
  return (
    <StatusScreen
      code="500"
      title={t("errors:500.title")}
      description={t("errors:500.description")}
      Icon={Bug}
    />
  );
};