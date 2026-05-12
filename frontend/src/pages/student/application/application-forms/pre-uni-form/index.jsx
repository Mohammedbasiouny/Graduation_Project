import React, { Activity, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '@/components/ui/Heading';
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { UserCheck, UserPlus } from 'lucide-react';
import { Alert } from '@/components/ui/Alert'
import ExistingStudentInputs from './existing-student-inputs';
import NewStudentInputs from './new-student-inputs';
import { SelectableCard } from '@/components/ui/cards/SelectableCard';

const PreUniForm = ({ data = null, isLoading = false }) => {
  const { t } = useTranslation();
  const { getParam, setParam } = useURLSearchParams();

  return (
    <div className='w-full space-y-10 p-5 rounded-lg bg-[#ffffff]'>
      <div className='w-fit'>
        <Alert
          dismissible={false}
          type="info"
          title={t("application-steps:forms.student_type.info_note.title")}
          collapsible
          defaultCollapsed
        >
          <p
            className={`
              whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
            `}
          >
            {t("application-steps:forms.student_type.info_note.description")}
          </p>
        </Alert>
      </div>

      <Heading 
        size='sm' 
        align="normal"
        title={t("application-steps:forms.student_type.heading.title")}
        subtitle={t("application-steps:forms.student_type.heading.subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["new", "all"].includes(getParam("current_period")) && (
          <SelectableCard
            title={t("new_student.title")}
            description={t("new_student.description")}
            icon={UserPlus}
            selected={getParam("student_type") === "new"}
            onClick={() => setParam("student_type", "new")}
          />
        )}
        {["old", "all"].includes(getParam("current_period")) && (
          <SelectableCard
            title={t("existing_student.title")}
            description={t("existing_student.description")}
            icon={UserCheck}
            selected={getParam("student_type") === "old"}
            onClick={() => setParam("student_type", "old")}
          />
        )}
      </div>

      <Activity mode={getParam("student_type") === "new" ? "visible" : "hidden"}>
        <div className='w-fit'>
          <Alert
            dismissible={false}
            type="warning"
            title={t("application-steps:forms.pre_uni.warning_note.title")}
            collapsible
            defaultCollapsed
          >
            <p
              className={`
                whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed
              `}
            >
              {t("application-steps:forms.pre_uni.warning_note.description")}
            </p>
          </Alert>
        </div>
        <NewStudentInputs data={data} isLoading={isLoading} />
      </Activity>

      <Activity mode={getParam("student_type") === "old" ? "visible" : "hidden"}>
        <ExistingStudentInputs />
      </Activity>
    </div>
  )
}

export default PreUniForm
