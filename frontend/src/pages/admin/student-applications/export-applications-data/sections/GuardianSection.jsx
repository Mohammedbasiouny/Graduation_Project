import DescriptionText from '@/components/ui/Form/DescriptionText'
import { Label } from '@/components/ui/Form/Label'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { GUARDIAN_NATIONALITY_OPTIONS } from '@/constants'
import React from 'react'
import InfoSection from './InfoSection'
import { getGuardianFieldsByType, getResidenceFieldsByType } from './utils'
import { useTranslation } from 'react-i18next'

const GuardianSection = ({
  guardianNationalityType, setGuardianNationalityType,
  selectedFields, onCheckboxChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-5'>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Residence Type */}
        <div className="space-y-2">
          <Label text={t("fields:guardian_nationality.label")} />
          <SelectBox
            options={GUARDIAN_NATIONALITY_OPTIONS(true)}
            value={guardianNationalityType}
            placeholder={t("fields:guardian_nationality.placeholder")}
            onChange={setGuardianNationalityType}
          />
          <DescriptionText description={t("fields:guardian_nationality.description")} />
        </div>
      </div>

      <InfoSection
        translationKey={"fields.guardian_info"}
        getFieldsByType={getGuardianFieldsByType}
        selectedFields={selectedFields}
        onCheckboxChange={onCheckboxChange}
        typeValue={guardianNationalityType}
      />
    </div>
  )
}

export default GuardianSection
