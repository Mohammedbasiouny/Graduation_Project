import { ChoiceSkeleton } from '@/components/ui/Form/Choice'
import { InputSkeleton } from '@/components/ui/Form/Input'
import { LabelSkeleton } from '@/components/ui/Form/Label'
import { TextareaSkeleton } from '@/components/ui/Form/Textarea'
import React from 'react'

const ResidenceInfoSectionSkeletion = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}

      <div className="space-y-2 col-span-1 md:col-span-3">
        <LabelSkeleton />
        <TextareaSkeleton rows={5} />
      </div>
    </div>
  )
}

export default ResidenceInfoSectionSkeletion
