import Heading from "@/components/ui/Heading";
import { useTranslation } from "react-i18next";
import BooleanQuestionWithDetails from "../BooleanQuestionWithDetails";
import { QUESTIONS } from "./validation";

const Treatments = ({ register, errors, control, watch }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <Heading
        size="sm"
        align="normal"
        title={t("medical-report-inputs:treatment.heading.title")}
        subtitle={t(
          "medical-report-inputs:treatment.heading.subtitle"
        )}
      />

      {QUESTIONS.map(({ key, withDetails }, idx) => (
        <div key={key} className="space-y-5">
          <BooleanQuestionWithDetails
            name={key}
            withDetails={withDetails}
            register={register}
            control={control}
            watch={watch}
            errors={errors}
            translationPath="medical-report-inputs:treatment.questions"
          />

          {idx !== QUESTIONS.length - 1 && (
            <hr className='w-[50%] h-1 bg-gray-300 text-white' />
          )}
        </div>
      ))}
    </div>
  );
};

export default Treatments;
