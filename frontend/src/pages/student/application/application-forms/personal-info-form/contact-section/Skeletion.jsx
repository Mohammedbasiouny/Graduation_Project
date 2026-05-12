import { InputSkeleton } from '@/components/ui/Form/Input'
import { LabelSkeleton } from '@/components/ui/Form/Label'
import React from 'react'

const ContactSectionSkeletion = ({ withLandlineNumber = false }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
      {Array.from({ length: withLandlineNumber ? 2 : 1 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </div>
      ))}
    </div>
  )
}

export default ContactSectionSkeletion
