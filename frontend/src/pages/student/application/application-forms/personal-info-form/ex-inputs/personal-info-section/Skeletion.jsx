import { ChoiceSkeleton } from '@/components/ui/Form/Choice'
import { InputSkeleton } from '@/components/ui/Form/Input'
import { LabelSkeleton } from '@/components/ui/Form/Label'
import React from 'react'

const PersonalInfoSkeletion = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}
        <div className="lg:col-span-2 space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>

        <div className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <div className='w-fit flex gap-10 mt-auto'>
            <ChoiceSkeleton />
            <ChoiceSkeleton />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PersonalInfoSkeletion
