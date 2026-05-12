import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import Heading from '@/components/ui/Heading';
import ChangeEmailSection from '@/pages/common/sections/ChangeEmailSection';
import ChangePasswordSection from '@/pages/common/sections/ChangePasswordSection';
import { useTranslation } from 'react-i18next';
import ChangeEmailSectionSkeleton from '@/pages/common/sections/ChangeEmailSection/ChangeEmailSectionSkeleton';
import { userAuthService } from '@/services/auth';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { translateDate, translateTime } from '@/i18n/utils';

const StudentAccountPage = () => {
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
    <div className='space-y-5 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen py-16 px-6 md:px-10'>
      <Heading 
        title={t("account:your_account_heading.title")}
        subtitle={t("account:your_account_heading.student_subtitle", { 
          uni: t(`universities.${user?.university}`), 
          createdAt: `${translateDate(formatToDateOnly(user?.created_at))}  -  ${translateTime(formatToTimeOnly(user?.created_at))}`
        })}
      />

      {loading ? (
        <ChangeEmailSectionSkeleton />
      ) : (
        <ChangeEmailSection email={user?.email} />
      )}

      <ChangePasswordSection />
    </div>
  );
};

export default StudentAccountPage;