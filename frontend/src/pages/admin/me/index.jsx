import Heading from '@/components/ui/Heading';
import { ALL_PERMISSIONS } from '@/constants';
import ChangeEmailSection from '@/pages/common/sections/ChangeEmailSection';
import ChangePasswordSection from '@/pages/common/sections/ChangePasswordSection';
import { useAuthStore } from '@/store/use-auth.store';
import { useTranslation } from 'react-i18next';
import UserInfoSection from './sections/UserInfoSection';
import PermissionsSection from './sections/PermissionsSection';
import { userAuthService } from '@/services/auth';
import ChangeEmailSectionSkeleton from '@/pages/common/sections/ChangeEmailSection/ChangeEmailSectionSkeleton';
import UserInfoSectionSkeleton from './sections/UserInfoSection/Skeleton';
import { useEffect, useState } from 'react';
import PermissionsSectionSkeleton from '@/pages/common/sections/PermissionsSectionSkeleton';

const AdminAccountPage = () => {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    const res = await userAuthService.getMyProfile();

    if (res?.status === 200) {
      setUser(res?.data?.data);
    } else {
      console.error('Failed to fetch profile');
    }

    setLoading(false);
  };

  useEffect(() => {
    getProfile();
  }, []);


  return (
    <div className='w-full space-y-5 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen p-6'>

      {/* Page Heading */}
      <Heading 
        title={t("account:your_account_heading.title")}
        subtitle={t("account:your_account_heading.admin_subtitle")}
      />

      {loading ? (
        <UserInfoSectionSkeleton />
      ) : (
        <UserInfoSection user={user} />
      )}


      {loading ? (
        <ChangeEmailSectionSkeleton />
      ) : (
        <ChangeEmailSection email={user?.email} />
      )}

      <ChangePasswordSection />

      {loading ? (
        <PermissionsSectionSkeleton />
      ) : (
        <PermissionsSection userPermissions={user?.permissions} />
      )}
    </div>
  )
}

export default AdminAccountPage;