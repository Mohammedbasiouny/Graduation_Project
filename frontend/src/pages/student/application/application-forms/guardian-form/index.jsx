import { Activity } from 'react'
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert'
import Stepper from '@/components/ui/Stepper';
import useURLSearchParams from '@/hooks/use-URL-search-params.hook';
import ParentsCurrentStatusForm from './inputs/status-inputs';
import GuardianInputs from './inputs/guardian-inputs';

const GuardianForm = ({ guardianInfo = null, parentsStatus = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { getParam } = useURLSearchParams();

  const currentStep = getParam("relatives_step") ?? "guardian";

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <div className='w-fit'>
        <Alert
          dismissible={false}
          type="warning"
          title={t("application-steps:forms.relatives.warning_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.relatives.warning_note.description")}
          </p>
        </Alert>
      </div>

      <Activity mode={currentStep === "guardian" ? "visible" : "hidden"}>
        <GuardianInputs data={guardianInfo} isLoading={isLoading} />
      </Activity>

      <Activity mode={currentStep === "parents_status" ? "visible" : "hidden"}>
        <ParentsCurrentStatusForm data={parentsStatus} isLoading={isLoading} />
      </Activity>

    </div>
  )
}

export default GuardianForm
