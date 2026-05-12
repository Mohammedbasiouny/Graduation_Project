import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import { Alert } from '@/components/ui/Alert'
import OutsideInputs from './outside-eg-inputs';
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import InsideInputs from './inside-eg-inputs';
import { Globe, Pyramid } from 'lucide-react';
import { Activity, useEffect } from 'react';
import { SelectableCard } from '@/components/ui/cards/SelectableCard';

const ResidenceForm = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { getParam, setParam } = useURLSearchParams();

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <div className='w-fit'>
        <Alert
          dismissible={false}
          type="warning"
          title={t("application-steps:forms.residence.warning_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.residence.warning_note.description")}
          </p>
        </Alert>
      </div>

      <Heading 
        size='sm' 
        align="normal"
        title={t("application-steps:forms.residence.residence_type_heading.title")}
        subtitle={t("application-steps:forms.residence.residence_type_heading.subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectableCard
          title={t("resident_in_egypt.title")}
          description={t("resident_in_egypt.description")}
          icon={Pyramid}
          selected={getParam("is_inside_egypt") === "true"}
          onClick={() => setParam("is_inside_egypt", true)}
        />
        <SelectableCard
          title={t("resident_outside_egypt.title")}
          description={t("resident_outside_egypt.description")}
          icon={Globe}
          selected={getParam("is_inside_egypt") === "false"}
          onClick={() => setParam("is_inside_egypt", false)}
        />
      </div>
      
      <Activity mode={getParam("is_inside_egypt") === "true" ? "visible" : "hidden"}>
        <InsideInputs data={data} isLoading={isLoading} />
      </Activity>
      <Activity mode={getParam("is_inside_egypt") === "false" ? "visible" : "hidden"}>
        <OutsideInputs data={data} isLoading={isLoading} />
      </Activity>
    </div>
  )
}

export default ResidenceForm
