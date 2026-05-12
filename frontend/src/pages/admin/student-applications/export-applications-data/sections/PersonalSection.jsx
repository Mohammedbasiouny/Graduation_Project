import DescriptionText from '@/components/ui/Form/DescriptionText'
import { Label } from '@/components/ui/Form/Label'
import { SelectBox } from '@/components/ui/Form/SelectBox'
import { GENDER_OPTIONS, RELIGION_OPTIONS, STUDENT_NATIONALITY_OPTIONS } from '@/constants'
import React from 'react'
import InfoSection from './InfoSection'
import { getPersonalFieldsByType } from './utils'
import { useTranslation } from 'react-i18next'

const PersonalSection = ({ 
  nationalityType, setNationalityType, 
  genderType, setGenderType, 
  religionType, setReligionType, 
  selectedFields, onCheckboxChange 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className='space-y-5'>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Nationality */}
        <div className="space-y-2">
          <Label text={t("fields:student_nationality.label")} />
          <SelectBox
            options={STUDENT_NATIONALITY_OPTIONS(true)}
            value={nationalityType}
            placeholder={t("fields:student_nationality.placeholder")}
            onChange={setNationalityType}
          />
          <DescriptionText description={t("fields:student_nationality.description")} />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label text={t("fields:gender.label")} />
          <SelectBox
            options={GENDER_OPTIONS(true)}
            value={genderType}
            placeholder={t("fields:gender.placeholder")}
            onChange={setGenderType}
          />
        </div>

        {/* Religion */}
        <div className="space-y-2">
          <Label text={t("fields:religion.label")} />
          <SelectBox
            options={RELIGION_OPTIONS(true)}
            value={religionType}
            placeholder={t("fields:religion.placeholder")}
            onChange={setReligionType}
          />
        </div>
      </div>

      <InfoSection
        translationKey={"fields.personal_info"}
        getFieldsByType={getPersonalFieldsByType}
        selectedFields={selectedFields}
        onCheckboxChange={onCheckboxChange}
        typeValue={nationalityType}
      />
    </div>
  )
}

export default PersonalSection
