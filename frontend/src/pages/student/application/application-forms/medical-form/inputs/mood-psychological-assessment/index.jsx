import Heading from '@/components/ui/Heading';
import { useTranslation } from 'react-i18next';
import RadioScaleAssessment from '../RadioScaleAssessment';
import { OPTIONS, QUESTIONS } from './validation';

const MoodPsychologicalAssessment = ({ errors, control }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <Heading
        size="sm"
        align="normal"
        title={t('medical-report-inputs:mood_psychological_assessment.heading.title')}
        subtitle={t('medical-report-inputs:mood_psychological_assessment.heading.subtitle')}
      />

      {/* ================= Desktop Table ================= */}
      <RadioScaleAssessment
        control={control}
        errors={errors}
        questions={QUESTIONS}
        options={OPTIONS}
        translationPath="medical-report-inputs:mood_psychological_assessment"
      />
    </div>
  );
};

export default MoodPsychologicalAssessment;
