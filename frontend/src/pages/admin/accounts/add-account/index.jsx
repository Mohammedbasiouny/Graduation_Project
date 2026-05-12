import Heading from '@/components/ui/Heading';
import { useTranslation } from 'react-i18next';
import ManageAccount from './ManageAccount';

const AddAccountPage = () => {
  const { t } = useTranslation();

  return (
    <div className='w-full space-y-5 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen p-6'>
      <Heading 
        title={t("account:account_heading.title")}
      />
      <ManageAccount />
    </div>
  )
}

export default AddAccountPage

