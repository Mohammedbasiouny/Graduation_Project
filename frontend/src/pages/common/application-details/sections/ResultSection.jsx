import Heading from '@/components/ui/Heading'
import { useTranslation } from 'react-i18next'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { EmptyData } from '@/components/ui/Table'
import InfoCard from '../components/InfoCard'
import { Button } from '@/components/ui/Button'
import { useModalStoreV2 } from '@/store/use.modal.store'
import { getResultState } from '@/utils/result-state.utils'
import { useEffect, useState } from 'react'

const ResultSection = ({ data }) => {
  const { t } = useTranslation()
  const { openModal } = useModalStoreV2();

  const [result, setResult] = useState({
    security_result_inquiry: getResultState("pending"),
    candidate_for_final_acceptance: getResultState("pending"),
    final_acceptance: getResultState("pending"),
    message_to_student: null
  })

  useEffect(() => {
    if (!data) return;
    setResult({
      security_result_inquiry: getResultState(data?.security_result_inquiry),
      candidate_for_final_acceptance: getResultState(data?.candidate_for_final_acceptance),
      final_acceptance: getResultState(data?.final_acceptance),
      message_to_student: data?.message_to_student == "" ? null : data?.message_to_student
    })
  }, [data])

  return (
    <CollapsibleSection
      title={t("track-application:application_result.heading.title")}
      subtitle={t("track-application:application_result.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <div className='w-full space-y-10'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <InfoCard
              label={t("fields:security_result_inquiry.label")}
              value={<span className={result.security_result_inquiry.color}>{result.security_result_inquiry.text}</span>}
            />
            <InfoCard
              label={t("fields:candidate_for_final_acceptance.label")}
              value={<span className={result.candidate_for_final_acceptance.color}>{result.candidate_for_final_acceptance.text}</span>}
            />
            <InfoCard
              label={t("fields:final_acceptance.label")}
              value={<span className={result.final_acceptance.color}>{result.final_acceptance.text}</span>}
            />
            <div className='col-span-1 md:col-span-2 lg:col-span-3'>
              <InfoCard
                label={t("fields:message_to_student.label")}
                value={result.message_to_student ?? t("NA")}
              />
            </div>
          </div>

          <div className='flex justify-end'>
            <Button 
              size="sm"
              variant="secondary"
              onClick={() => openModal("change-student-result", { id: data?.student_id })}
            >
              {t("track-application:application_result.buttons.change_result")}
            </Button>
          </div>
        </div>
      )}
    </CollapsibleSection>
  )
}

export default ResultSection
