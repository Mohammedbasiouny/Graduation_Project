import { SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatusScreen from "@/components/screens/StatusScreen";
import { useLayoutStore } from '@/store/use-layout.store';
import { useEffect } from "react";

export default function NotFoundPage () {
  const { t } = useTranslation();
  const { setShowBreadcrumbs } = useLayoutStore();

  useEffect(() => {
    setShowBreadcrumbs(false)
  }, [setShowBreadcrumbs])
  
  return (
    <StatusScreen
      code="404"
      title={t("errors:404.title")}
      description={t("errors:404.description")}
      Icon={SearchX}
    />
  );
};