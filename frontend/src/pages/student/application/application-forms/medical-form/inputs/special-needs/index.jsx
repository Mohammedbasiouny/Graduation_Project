import { RadioButton } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import Field from '@/components/ui/Form/Field';
import { Label } from '@/components/ui/Form/Label';
import { Textarea } from '@/components/ui/Form/Textarea';
import Heading from '@/components/ui/Heading'
import React from 'react'
import { useTranslation } from 'react-i18next';
import { QUESTIONS } from './validation';
import BooleanQuestionWithDetails from '../BooleanQuestionWithDetails';

const SpecialNeeds = ({ register, errors, control, watch }) => {
    const { t } = useTranslation();
  
  return (
    <div className='space-y-5'>
      <Heading 
        size='sm' 
        align="normal"
        title={t("medical-report-inputs:special_needs.heading.title")}
        subtitle={t("medical-report-inputs:special_needs.heading.subtitle")}
      />
      
      {QUESTIONS.map(({ key, withDetails }, idx) => (
        <div key={key} className="space-y-5">
          <BooleanQuestionWithDetails
            name={key}
            withDetails={withDetails}
            register={register}
            control={control}
            watch={watch}
            errors={errors}
            translationPath="medical-report-inputs:special_needs.questions"
          />

          {idx !== QUESTIONS.length - 1 && (
            <hr className='w-[50%] h-1 bg-gray-300 text-white' />
          )}
        </div>
      ))}
    </div>
  )
}

export default SpecialNeeds
