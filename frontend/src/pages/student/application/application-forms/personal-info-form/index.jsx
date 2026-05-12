import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert'
import { useParams } from 'react-router';
import { Activity } from 'react';
import EgInputs from './eg-inputs';
import ExInputs from './ex-inputs';

const PersonalInfoForm = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { nationality } = useParams();

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <div className='w-fit'>
        <Alert
          dismissible={false}
          type="warning"
          title={t("application-steps:forms.personal.warning_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.personal.warning_note.description")}
          </p>
        </Alert>
      </div>
      
      <Activity mode={nationality === "egyptian" ? "visible" : "hidden"}>
        <EgInputs data={data} isLoading={isLoading} />
      </Activity>
      <Activity mode={nationality === "expatriate" ? "visible" : "hidden"}>
        <ExInputs data={data} isLoading={isLoading} />
      </Activity>
    </div>
  )
}

export default PersonalInfoForm
