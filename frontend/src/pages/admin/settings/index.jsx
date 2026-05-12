import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Form/Choice';
import DescriptionText from '@/components/ui/Form/DescriptionText';
import { Input } from '@/components/ui/Form/Input';
import { Label } from '@/components/ui/Form/Label';
import Heading from '@/components/ui/Heading';
import { FileCog } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { validationSchema } from './validation';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSettings, useUpdateSettings } from '@/hooks/api/settings.hooks';
import { translateDate, translateTime } from '@/i18n/utils';
import { formatToDateOnly, formatToTimeOnly } from '@/utils/format-date-and-time.utils';
import { showToast } from '@/utils/toast.util';
import { applyFormServerErrors } from '@/utils/api.utils';

const SettingsPage = () => {
  const { t } = useTranslation();

  const [row, setRow] = useState({});

  const { register, handleSubmit, formState: { errors }, control, setError, reset } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { data, isLoading } = useSettings();

  useEffect(() => {
    if (data?.data?.data) {
      setRow(data.data.data);
      reset({
        application_period_open: data.data.data.application_period_open,
        admission_results_announced: data.data.data.admission_results_announced,
        online_payment_available: data.data.data.online_payment_available,
        university_housing_started: data.data.data.university_housing_started,
        female_visits_available: data.data.data.female_visits_available,
        restaurant_status: data.data.data.restaurant_status,
        auto_meal_reserve: data.data.data.auto_meal_reserve,
        attendance_start: String(data.data.data.attendance_start).slice(0,5),
        attendance_end: String(data.data.data.attendance_end).slice(0,5),
      })
    }
  }, [data, reset]);

  const { 
    mutate: updateSettings, 
    isPending: isUpdating,
    isSuccess, 
    isError, 
    error
  } = useUpdateSettings();

  /* ---------------- Submit Handler ---------------- */
  const onSubmit = (data) => {
    const payload = {
      ...data,
      attendance_start: data.attendance_start + ":00",
      attendance_end: data.attendance_end + ":00",
    }
    updateSettings(payload);
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
      // success toast is shown in the hook's onSuccess callback
    } else if (isError) {
      const res = error.response;
      if (res?.status == 404) {
        showToast("error", t("messages:update_not_found"));
      } else if (res?.status == 422) {
        showToast("error", t("messages:validation_error"));
        applyFormServerErrors(res?.data?.errors, setError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <div className="w-full space-y-5 bg-white rounded-2xl shadow-md border border-(--gray-lightest) p-6">
      <Heading
        title={t("settings:heading.title")}
        subtitle={t("settings:heading.subtitle")}
      />

      <p className='text-red-700 font-bold text-center'>{t("settings:last_updated", { date: translateDate(formatToDateOnly(row.updated_at)), time: translateTime(formatToTimeOnly(row.updated_at)) })}</p>

      <Alert
        icon={FileCog}
        type="info"
        title={t("settings:warning_note.title")}
        collapsible
        defaultCollapsed
        dismissible={false}
      >
        <p className="whitespace-pre-wrap wrap-break-words rtl:font-ar ltr:font-en text-sm sm:text-base leading-relaxed">
          {t("settings:warning_note.description")}
        </p>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)}  className='space-y-5'>
        <div className='w-full h-full space-y-5 border-b border-(--gray-light) pb-5'>
          <Heading
            align='start'
            title={t("settings:sections.application_period.title")}
            subtitle={t("settings:sections.application_period.description")}
            size="sm"
          />
          <div className='space-y-2'>
            <Switch 
              label={t("fields:application_period_open.label")} 
              {...register("application_period_open")}
              error={errors.application_period_open?.message}
            />
            <DescriptionText description={t("fields:application_period_open.description")} />
          </div>
          <p className='text-sm text-muted-foreground'>
            {t("fields:application_period_open.hint", { date: translateDate(formatToDateOnly(row.application_period_open_changed_at)), time: translateTime(formatToTimeOnly(row.application_period_open_changed_at)) })}
          </p>
        </div>
        <div className='w-full h-full space-y-5 border-b border-(--gray-light) pb-5'>
          <Heading
            align='start'
            title={t("settings:sections.housing.title")}
            subtitle={t("settings:sections.housing.description")}
            size="sm"
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <Switch 
                label={t("fields:admission_results_announced.label")} 
                {...register("admission_results_announced")}
                error={errors.admission_results_announced?.message}
              />
              <DescriptionText description={t("fields:admission_results_announced.description")} />
            </div>
            <div className='space-y-2'>
              <Switch 
                label={t("fields:online_payment_available.label")} 
                {...register("online_payment_available")}
                error={errors.online_payment_available?.message}
              />
              <DescriptionText description={t("fields:online_payment_available.description")} />
            </div>
            <div className='space-y-2'>
              <Switch 
                label={t("fields:university_housing_started.label")} 
                {...register("university_housing_started")}
                error={errors.university_housing_started?.message}
              />
              <DescriptionText description={t("fields:university_housing_started.description")} />
            </div>
            <div className='space-y-2'>
              <Switch 
                label={t("fields:female_visits_available.label")} 
                {...register("female_visits_available")}
                error={errors.female_visits_available?.message}
              />
              <DescriptionText description={t("fields:female_visits_available.description")} />
            </div>
          </div>
        </div>
        <div className='w-full h-full space-y-5 border-b border-(--gray-light) pb-5'>
          <Heading
            align='start'
            title={t("settings:sections.resturant.title")}
            subtitle={t("settings:sections.resturant.description")}
            size="sm"
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-2'>
              <Switch 
                label={t("fields:restaurant_status.label")} 
                {...register("restaurant_status")}
                error={errors.restaurant_status?.message}
              />
              <DescriptionText description={t("fields:restaurant_status.description")} />
            </div>
            <div className='space-y-2'>
              <Switch 
                label={t("fields:auto_meal_reserve.label")} 
                {...register("auto_meal_reserve")}
                error={errors.auto_meal_reserve?.message}
              />
              <DescriptionText description={t("fields:auto_meal_reserve.description")} />
            </div>
          </div>
        </div>
        <div className='w-full h-full space-y-5 border-b border-(--gray-light) pb-5'>
          <Heading
            align='start'
            title={t("settings:sections.attendance.title")}
            subtitle={t("settings:sections.attendance.description")}
            size="sm"
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className="space-y-2">
              <Label text={t("fields:attendance_start.label")} required />
              <Input
                type="time"
                {...register("attendance_start")}
                error={errors.attendance_start?.message}
              />
              <DescriptionText description={t("fields:attendance_start.description")} />
            </div>
            <div className="space-y-2">
              <Label text={t("fields:attendance_end.label")} required />
              <Input
                type="time"
                {...register("attendance_end")}
                error={errors.attendance_end?.message}
              />
              <DescriptionText description={t("fields:attendance_end.description")} />
            </div>
          </div>
        </div>

        <div className='w-full flex justify-center'>
          <Button isLoading={isLoading || isUpdating} variant='secondary'>
            {isLoading || isUpdating ? t("buttons:isLoading") : t("settings:save_changes")}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage