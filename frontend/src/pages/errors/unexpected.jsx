import { Bomb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatusScreen from '@/components/screens/StatusScreen';
import { useLayoutStore } from '@/store/use-layout.store';
import { useEffect } from 'react';

export default function UnexpectedPage () {
  const { t } = useTranslation();
  const { setShowBreadcrumbs } = useLayoutStore();

  useEffect(() => {
    setShowBreadcrumbs(false)
  }, [setShowBreadcrumbs])
  
  return (
    <StatusScreen
      title={t("errors:default.title")}
      description={t("errors:default.description")}
      Icon={Bomb}
    />
  );
}