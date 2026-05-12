import { InputSkeleton } from '@/components/ui/Form/Input'
import { LabelSkeleton } from '@/components/ui/Form/Label'
import { TextareaSkeleton } from '@/components/ui/Form/Textarea'
import Heading from '@/components/ui/Heading'
import React from 'react'
import { useTranslation } from 'react-i18next'

const InputsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <div className='w-full space-y-5'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <LabelSkeleton />
            <InputSkeleton />
          </div>
        ))}
      </div>
      <hr className='w-full h-0.5 bg-(--gray-light)' />
      <div className='space-y-5'>
        <Heading 
          size='sm' 
          align="normal"
          title={t("application-steps:forms.upload_files.heading.title")}
          subtitle={t("application-steps:forms.upload_files.heading.subtitle")}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <LabelSkeleton />
              <TextareaSkeleton rows={6} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InputsSkeleton
