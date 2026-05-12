import React from "react";
import { useTranslation } from "react-i18next";
import RenderCheckBoxes from "../components/RenderCheckBoxes";

const InfoSection = ({
  translationKey,       // e.g., "fields.academic_info"
  getFieldsByType,      // e.g., getAcadmicFieldsByType
  selectedFields,
  onCheckboxChange,
  typeValue             // optional, e.g., acadmicType / nationalityType / preUniEduType
}) => {
  const { t } = useTranslation();

  const fields = t(`manage-students-files:${translationKey}`, { returnObjects: true });

  const fieldsToShow = typeValue ? getFieldsByType(fields, typeValue) : getFieldsByType(fields);

  return (
    <div className="w-full space-y-5">
      <h3 className="font-semibold text-lg mb-3">{t(`manage-students-files:${translationKey}.title`)}</h3>
      <RenderCheckBoxes
        fieldsToShow={fieldsToShow}
        selectedFields={selectedFields}
        onCheckboxChange={onCheckboxChange}
      />
    </div>
  );
};

export default InfoSection;