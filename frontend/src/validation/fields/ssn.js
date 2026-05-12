import * as Yup from "yup";
import i18n from "@/i18n";

export const ssn = ({ required = true } = {}) => {
    const validCodes = [
    "01","02","03","04","11","12","13","14","15","16","17","18","19",
    "21","22","23","24","25","26","27","28","29","31","32","33","34","35","88"
  ];

  let schema = Yup.string().trim();

  if (required) {
    schema = schema
      .matches(/^[23]\d{13}$/, () => i18n.t("validations:ssn.invalid"))
      .test("valid-date", () => i18n.t("validations:ssn.invalidDate"), (value) => {
        if (!value || value.length !== 14) return false;

        const century = value[0] === "2" ? 1900 : 2000;
        const year = parseInt(value.slice(1, 3), 10) + century;
        const month = parseInt(value.slice(3, 5), 10);
        const day = parseInt(value.slice(5, 7), 10);

        const date = new Date(year, month - 1, day);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      })
      .test(
        "valid-governorate",
        () => i18n.t("validations:ssn.invalidGovernorate"),
        (value) => {
          if (!value || value.length < 9) return false;

          const code = value.slice(7, 9); // digits 8 & 9
          return validCodes.includes(code);
        }
      )
      .length(14, () => i18n.t("validations:ssn.length"))
      .required(() => i18n.t("validations:ssn.required"));
  }

  return schema;
};
