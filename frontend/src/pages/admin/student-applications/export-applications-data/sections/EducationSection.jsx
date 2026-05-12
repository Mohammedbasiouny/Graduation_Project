import React from 'react'
import { getAcadmicFieldsByType, getPreUniEduFieldsByType } from './utils';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/Form/Label';
import { SelectBox } from '@/components/ui/Form/SelectBox';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import { GRADE_OPTIONS, PRE_UNIVERSITY_EDUCATION_OPTIONS, STUDENT_TYPE_OPTIONS, UNIVERSITIES_OPTIONS } from '@/constants';
import InfoSection from './InfoSection';
import { InputSkeleton } from '@/components/ui/Form/Input';
import Field from '@/components/ui/Form/Field';

const EducationSection = ({
  studentType, setStudentType,
  preUniEduType, setPreUniEduType,
  selectedFields, onCheckboxChange 
}) => {
  const { t } = useTranslation();

  // Configuration array for all sections
  const sections = [
    // Pre-university only for new students
    ...(studentType !== "old" ? [{
      translationKey: "fields.pre_uni_edu_info",
      getFieldsByType: getPreUniEduFieldsByType,
      typeValue: preUniEduType
    }] : []),
    {
      translationKey: "fields.academic_info",
      getFieldsByType: getAcadmicFieldsByType,
      typeValue: studentType
    },
  ];

  return (
    <div className='space-y-5'>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Type */}
        <div className="space-y-2">
          <Label text={t("fields:student_type.label")} />
          <SelectBox
            options={STUDENT_TYPE_OPTIONS()}
            value={studentType}
            placeholder={t("fields:student_type.placeholder")}
            onChange={setStudentType}
          />
          <DescriptionText description={t("fields:student_type.description")} />
        </div>

        {/* Pre-University Education */}
        {studentType !== "old" && (
          <div className="space-y-2">
            <Label text={t("fields:pre_university_education.label")} />
            <SelectBox
              options={PRE_UNIVERSITY_EDUCATION_OPTIONS(true)}
              value={preUniEduType}
              placeholder={t("fields:pre_university_education.placeholder")}
              onChange={setPreUniEduType}
            />
            <DescriptionText description={t("fields:pre_university_education.description")} />
          </div>
        )}
      </div>

      {sections.map((section, idx) => (
        <React.Fragment key={section.translationKey}>
          {idx > 0 && <hr className="w-full h-0.5 bg-(--gray-light)" />}
          <InfoSection
            translationKey={section.translationKey}
            getFieldsByType={section.getFieldsByType}
            selectedFields={selectedFields}
            onCheckboxChange={onCheckboxChange}
            typeValue={section.typeValue}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export default EducationSection
