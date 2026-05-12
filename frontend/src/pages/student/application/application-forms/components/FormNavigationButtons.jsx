import { Button, ButtonSkeleton } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useGetCurrentPeriod, useGetPeriodStatus } from '../../hooks';
import { useEffect, useState } from 'react';

const FormNavigationButtons = ({
  isLoading,
  data,
  onPrevious,
  onNext,
  isEnd = false
}) => {
  const [isValidPeriodData, setIsValidPeriodData] = useState(true)

  const { t } = useTranslation();
  const { periodStatus, isLoading: periodStatusIsLoading } = useGetPeriodStatus();

  const { currentPeriod, isLoading: currentPeriodIsLoading } =
    useGetCurrentPeriod();

  useEffect(() => {
    if (!data?.applied_at) {
      return
    }
    const isValid =
      !currentPeriodIsLoading &&
      data?.applied_at &&
      currentPeriod &&
      new Date(data.applied_at) >= new Date(currentPeriod.startAt) &&
      new Date(data.applied_at) <= new Date(currentPeriod.endAt);

      setIsValidPeriodData(isValid)
  }, [currentPeriodIsLoading, data, currentPeriod])
  

  if (isLoading || periodStatusIsLoading || currentPeriodIsLoading) {
    <div className="mt-15 flex gap-5 flex-col items-center">
      <ButtonSkeleton size='lg' />
    </div>
  }

  // =========================
  // 1. PERIOD CLOSED STATE
  // =========================
  if (!periodStatus) {
    return (
      <div className="mt-15 flex gap-5 flex-col items-center">
        <Button
          size="lg"
          variant={'error'}
          disabled
          type="button"
        >
          <p className="whitespace-pre-wrap wrap-break-words">
            {t('application-steps:buttons.period_closed')}
          </p>
        </Button>
      </div>
    );
  }

  // =========================
  // 1. NO CURRENT PERIOD
  // =========================
  if (!currentPeriod) {
    return (
      <div className="mt-15 flex gap-5 flex-col items-center">
        <Button
          size="lg"
          variant={'info'}
          disabled
          type="button"
        >
          <p className="whitespace-pre-wrap wrap-break-words">
            {t('application-steps:buttons.wait_for_applications_period_start')}
          </p>
        </Button>
      </div>
    );
  }

  // =========================
  // 2. INVALID PERIOD DATA STATE
  // =========================
  if (!isValidPeriodData) {
    return (
      <div className="mt-15 flex gap-5 flex-col items-center">
        <Button
          size="lg"
          variant="warning"
          disabled
          type="button"
        >
          <p className="whitespace-pre-wrap wrap-break-words">
            {t(
              'application-steps:buttons.update_data_not_available'
            )}
          </p>
        </Button>
      </div>
    );
  }

  // =========================
  // 3. NORMAL FLOW
  // =========================
  return (
    <div className='mt-15 flex gap-5 flex-col items-center'>
      <Button 
        size="lg" 
        variant="success" 
        isLoading={isLoading}
      >
        {t("application-steps:buttons.save_changes")}
      </Button>

      <div className='w-full flex flex-wrap justify-center gap-5'>
        <Button 
          size="lg" 
          variant="cancel" 
          type="button"
          onClick={onPrevious}
        >
          {t("application-steps:buttons.previous")}
        </Button>

        {data?.applied_at && (
          <Button 
            size="lg" 
            variant={isEnd ? "info" : "secondary"} 
            isLoading={isLoading}
            type="button"
            onClick={onNext}
          >
            {t(`application-steps:buttons.${isEnd ? "end" : "next"}`)}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigationButtons;
