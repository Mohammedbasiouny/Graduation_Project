import { useTranslation } from 'react-i18next';
import InfoSection from './InfoSection';
import { getHousingFieldsByType } from './utils';

const HousingSection = ({
  selectedFields, onCheckboxChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-5'>
      <InfoSection
        translationKey={"fields.housing_info"}
        getFieldsByType={getHousingFieldsByType}
        selectedFields={selectedFields}
        onCheckboxChange={onCheckboxChange}
      />
    </div>
  )
}

export default HousingSection
