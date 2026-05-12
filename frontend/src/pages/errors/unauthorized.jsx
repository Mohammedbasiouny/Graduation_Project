import { Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatusScreen from '@/components/screens/StatusScreen';
import { useLayoutStore } from '@/store/use-layout.store';
import { useEffect } from 'react';

export default function UnauthorizedPage () {
  const { t } = useTranslation();
  const { setShowBreadcrumbs } = useLayoutStore();

  useEffect(() => {
    setShowBreadcrumbs(false)
  }, [setShowBreadcrumbs])
  
  return (
    <StatusScreen
      code="401"
      title={t("errors:401.title")}
      description={t("errors:401.description")}
      Icon={Key}
    />
  );
}