import DescriptionText from '@/components/ui/Form/DescriptionText'
import { Label } from '@/components/ui/Form/Label'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { RESIDENCE_TYPE_OPTIONS } from '@/constants'
import React from 'react'
import InfoSection from './InfoSection'
import { getResidenceFieldsByType } from './utils'
import { useTranslation } from 'react-i18next'
import { InputSkeleton } from '@/components/ui/Form/Input'
import Field from '@/components/ui/Form/Field'

const ResidenceSection = ({
  residenceType, setResidenceType,
  selectedFields, onCheckboxChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-5'>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Residence Type */}
        <div className="space-y-2">
          <Label text={t("fields:residence_type.label")} />
          <SelectBox
            options={RESIDENCE_TYPE_OPTIONS(true)}
            value={residenceType}
            placeholder={t("fields:residence_type.placeholder")}
            onChange={setResidenceType}
          />
          <DescriptionText description={t("fields:residence_type.description")} />
        </div>
      </div>

      <InfoSection
        translationKey={"fields.residence_info"}
        getFieldsByType={getResidenceFieldsByType}
        selectedFields={selectedFields}
        onCheckboxChange={onCheckboxChange}
        typeValue={residenceType}
      />
    </div>
  )
}

export default ResidenceSection
