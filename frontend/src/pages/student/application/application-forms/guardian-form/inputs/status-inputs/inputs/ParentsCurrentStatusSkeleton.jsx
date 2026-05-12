import { ChoiceSkeleton } from '@/components/ui/Form/Choice'
import { InputSkeleton } from '@/components/ui/Form/Input'
import { LabelSkeleton } from '@/components/ui/Form/Label'
import React from 'react'

const ParentsCurrentStatusSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-20">
      {Array.from({ length: 1 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}

      <div className="space-y-2">
        <LabelSkeleton />
        <div className='w-fit flex gap-10 mt-auto'>
          <ChoiceSkeleton />
          <ChoiceSkeleton />
        </div>
      </div>
    </div>
  )
}

export default ParentsCurrentStatusSkeleton
