import { RadioButton } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import ErrorText from '@/components/ui/Form/ErrorText';
import { Label } from '@/components/ui/Form/Label';
import Heading from '@/components/ui/Heading';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { QUESTIONS } from './validation';

const BehavioralSocialAspects = ({ errors, control }) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-5'>
      <Heading
        size="sm"
        align="normal"
        title={t("medical-report-inputs:behavioral_social_aspects.heading.title")}
        subtitle={t("medical-report-inputs:behavioral_social_aspects.heading.subtitle")}
      />
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {QUESTIONS.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label
                text={t(
                  `medical-report-inputs:behavioral_social_aspects.questions.${field.key}.label`
                )}
                required
              />

              <div className="w-fit flex items-center gap-5">
                <Controller
                  name={field.key}
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-5">
                      <RadioButton
                        label={t('yes')}
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                      />
                      <RadioButton
                        label={t('no')}
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                      />
                    </div>
                  )}
                />
              </div>

              <DescriptionText
                description={t(
                  `medical-report-inputs:behavioral_social_aspects.questions.${field.key}.description`
                )}
              />
              <div>
                <ErrorText error={errors?.[`${field.key}`]?.message} />
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default BehavioralSocialAspects;
