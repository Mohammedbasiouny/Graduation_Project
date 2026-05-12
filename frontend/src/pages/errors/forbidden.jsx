import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatusScreen from '@/components/screens/StatusScreen';
import { useEffect } from 'react';
import { useLayoutStore } from '@/store/use-layout.store';

export default function ForbiddenPage () {
  const { t } = useTranslation();
  const { setShowBreadcrumbs } = useLayoutStore();

  useEffect(() => {
    setShowBreadcrumbs(false)
  }, [setShowBreadcrumbs])
  
  return (
    <StatusScreen
      code="403"
      title={t("errors:403.title")}
      description={t("errors:403.description")}
      Icon={Lock}
    />
  );
}
