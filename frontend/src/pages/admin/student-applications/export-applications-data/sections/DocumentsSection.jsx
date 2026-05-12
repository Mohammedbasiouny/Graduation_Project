import React from 'react'
import { getDocumentsFields } from './utils'
import RenderCheckBoxes from '../components/RenderCheckBoxes';
import { useTranslation } from 'react-i18next';

const DocumentsSection = ({
  nationality, residenceOutside,
  studentStatus, guardianType,
  selectedFields, onCheckboxChange 
}) => {
  const { t } = useTranslation();

  const section = t(`manage-students-files:fields.documents`, { returnObjects: true });
  const fieldsToShow = getDocumentsFields({ nationality, residenceOutside, studentStatus, guardianType, section });

  return (
    <div className="w-full space-y-5">
      <h3 className="font-semibold text-lg mb-3">{t(`manage-students-files:fields.documents.title`)}</h3>
      <RenderCheckBoxes
        fieldsToShow={fieldsToShow}
        selectedFields={selectedFields}
        onCheckboxChange={onCheckboxChange}
      />
    </div>
  )
}

export default DocumentsSection
