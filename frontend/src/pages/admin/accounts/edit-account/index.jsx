import Heading from '@/components/ui/Heading';
import { useTranslation } from 'react-i18next';
import { ALL_PERMISSIONS } from '@/constants';
import ChangeEmailSection from '@/pages/common/sections/ChangeEmailSection';
import GrantPermissionsSection from './sections/GrantPermissionsSection';
import ChangeUserInfoSection from './sections/ChangeUserInfoSection';
import { useParams } from 'react-router';
import ChangeStudentUniSection from './sections/ChangeStudentUniSection';
import BlockUserModal from '../modals/BlockUserModal';
import DeleteUserModal from '../modals/DeleteUserModal';
import { useUser } from '@/hooks/api/manage-users.hook';
import { useEffect, useState } from 'react';
import ChangeUserInfoSectionSkeleton from './sections/ChangeUserInfoSection/Skeleton';
import ChangeEmailSectionSkeleton from '@/pages/common/sections/ChangeEmailSection/ChangeEmailSectionSkeleton';
import PermissionsSectionSkeleton from '../../../common/sections/PermissionsSectionSkeleton';

const EditAccountPage = () => {
  const { t } = useTranslation();
  const { role, id } = useParams();
  const [user, setUser] = useState(null);

  const { data, isLoading, refetch} = useUser(id);

  useEffect(() => {
    if (!data?.data?.data) return;
    const row = data.data.data;
    setUser(row);
  }, [data, t]);

  return (
    <div className='w-full space-y-5 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen p-6'>
      <Heading 
        title={t("account:account_heading.title")}
        subtitle={t("account:account_heading.subtitle")}
      />

      {isLoading ? <ChangeUserInfoSectionSkeleton length={role === "student" ? 3 : 6} /> : (
        <>
          {role === "student" && (
            <ChangeStudentUniSection user={user} />
          )}
          {role !== "student" && (
            <ChangeUserInfoSection user={user} />
          )}
        </>
      )}

      {isLoading ? (
        <ChangeEmailSectionSkeleton />
      ) : (
        <ChangeEmailSection userID={user?.id} email={user?.email} />
      )}

      {isLoading ? (
        <PermissionsSectionSkeleton />
      ) : (
        role !== "student" && (
          <GrantPermissionsSection userID={user?.id} userPermissions={user?.permissions} />
        )
      )}

      <DeleteUserModal />
      <BlockUserModal refetch={refetch} />
    </div>
  )
}

export default EditAccountPage
