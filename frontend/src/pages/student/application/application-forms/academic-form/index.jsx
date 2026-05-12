import { Activity, useEffect } from 'react'
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/Alert'
import NewStudentInputs from './new-student-inputs';
import OldStudentInputs from './old-student-inputs';

const AcademicForm = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { getParam, setParam } = useURLSearchParams();

  useEffect(() => {
    if (!getParam("student_type")) {
      setParam("student_type", "old")
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <div className='w-fit'>
        <Alert
          dismissible={false}
          type="info"
          title={t("application-steps:forms.academic.info_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.academic.info_note.description")}
          </p>
        </Alert>
      </div>
      <Activity mode={getParam("student_type") === "new" ? "visible" : "hidden"}>
        <NewStudentInputs data={data} isLoading={isLoading} />
      </Activity>

      <Activity mode={getParam("student_type") === "old" ? "visible" : "hidden"}>
        <OldStudentInputs data={data} isLoading={isLoading} />
      </Activity>
    </div>
  )
}

export default AcademicForm
