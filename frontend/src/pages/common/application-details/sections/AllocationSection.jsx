import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { allocationValidationSchema } from '../validation';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import { EmptyData } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { AllocationInputs } from '../inputs/AllocationInputs';

const AllocationSection = ({ data }) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(allocationValidationSchema),
    mode: 'onChange',
    defaultValues: {
      building_type: "",
      building_id: "",
      floor: "",
      room_type: "",
      room_id: "",
      notes: "",
    }
  });

  const onSubmit = (data) => {
    // if (!modalData?.id) return;
    // updateApplicationResult({ id: modalData.id, data });
    console.log(data);
    
  };

  return (
    <CollapsibleSection
      title={t("track-application:student_allocation.heading.title")}
      subtitle={t("track-application:student_allocation.heading.subtitle")}
    >
      {!data ? (
        <EmptyData />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-10'>
          <AllocationInputs register={register} watch={watch} setValue={setValue} control={control} errors={errors} /> 

          <div className='flex justify-end'>
            <Button size="sm" variant="secondary">
              {t("track-application:student_allocation.buttons.change_allocation")}
            </Button>
          </div>
        </form>
      )}
    </CollapsibleSection>
  )
}

export default AllocationSection