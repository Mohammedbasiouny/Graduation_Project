import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ErrorText from "@/components/ui/Form/ErrorText";
import { Label } from "@/components/ui/Form/Label";

const RadioScaleAssessment = ({
  questions,
  options,
  translationPath,
  control,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      {/* ================= Desktop Table ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-300 text-lg text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">
                {t("question")}
              </th>

              {options.map((opt) => (
                <th key={opt} className="border px-3 py-2">
                  {t(`${translationPath}.options.${opt}`)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {questions.map((name) => (
              <tr key={name} className="hover:bg-gray-50 align-top">
                {/* Question */}
                <td className="border px-3 py-2 ltr:text-left rtl:text-right">
                  <Label
                    text={t(
                      `${translationPath}.questions.${name}.label`
                    )}
                    required
                  />
                  <ErrorText error={errors?.[name]?.message} />
                </td>

                {/* Options */}
                {options.map((opt) => (
                  <td key={opt} className="border px-3 py-2">
                    <Controller
                      name={name}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="radio"
                          value={opt}
                          checked={field.value === opt}
                          onChange={() => field.onChange(opt)}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile Cards ================= */}
      <div className="md:hidden space-y-4">
        {questions.map((name) => (
          <div
            key={name}
            className="border rounded-lg p-4 space-y-3 shadow-sm"
          >
            <Label
              text={t(
                `${translationPath}.questions.${name}.label`
              )}
              required
            />

            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <input
                        type="radio"
                        value={opt}
                        checked={field.value === opt}
                        onChange={() => field.onChange(opt)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      {t(
                        `${translationPath}.options.${opt}`
                      )}
                    </label>
                  ))}
                </div>
              )}
            />

            <ErrorText error={errors?.[name]?.message} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioScaleAssessment;
