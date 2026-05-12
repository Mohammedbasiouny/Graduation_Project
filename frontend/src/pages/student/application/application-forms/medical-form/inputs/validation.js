// validation/buildBooleanWithDetails.js
import i18n from "@/i18n";
import { radio, text } from "@/validation/fields";

export const buildBooleanWithDetailsSchema = (
  questions,
  {
    detailsMin = 5,
    detailsMax = 600,
  } = {}
) =>
  questions.reduce((shape, question) => {
    const key = typeof question === "string" ? question : question.key;
    const hasDetails =
      typeof question === "object" ? question.withDetails !== false : true;

    // main boolean
    shape[key] = radio({ required: true, type: "boolean" });

    // optional details
    if (hasDetails) {
      shape[`${key}_details`] = text({
        required: false,
        min: detailsMin,
        max: detailsMax,
      })
        .nullable()
        .transform((value) => value ?? "")
        .when(key, {
          is: true,
          then: (schema) =>
            schema.required(
              i18n.t("text.required", { ns: "validations" })
            ),
          otherwise: (schema) => schema.strip(),
        });
    }

    return shape;
  }, {});
