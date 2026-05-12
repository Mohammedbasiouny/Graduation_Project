import { Checkbox } from '@/components/ui/Form/Choice'
import React from 'react'

const RenderCheckBoxes = ({ fieldsToShow, selectedFields, onCheckboxChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Object.entries(fieldsToShow).map(([key, label]) => (
        <Checkbox
          key={key}
          label={label}
          checked={selectedFields.includes(key)}
          onChange={onCheckboxChange(key)}
        />
      ))}
    </div>
  )
}

export default RenderCheckBoxes
