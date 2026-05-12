import Heading from "@/components/ui/Heading";
import { useTranslation } from "react-i18next";
import BooleanQuestionWithDetails from "../BooleanQuestionWithDetails";
import { QUESTIONS } from "./validation";

const ChronicDiseases = ({ register, errors, control, watch }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <Heading
        size="sm"
        align="normal"
        title={t("medical-report-inputs:chronic_diseases.heading.title")}
        subtitle={t(
          "medical-report-inputs:chronic_diseases.heading.subtitle"
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
            translationPath="medical-report-inputs:chronic_diseases.questions"
          />

          {idx !== QUESTIONS.length - 1 && (
            <hr className='w-[50%] h-1 bg-gray-300 text-white' />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChronicDiseases;
