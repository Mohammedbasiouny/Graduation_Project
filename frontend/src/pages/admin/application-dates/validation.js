import * as Yup from "yup";
import { text, select, datetime } from "@/validation/fields";

export const validationSchema = ({
  customStartDate = null,
} = {}) => {
  let startDateObj = customStartDate
    ? new Date(customStartDate)
    : new Date();

  startDateObj.setHours(0, 0, 0, 0);

  if (customStartDate) {
    startDateObj.setDate(startDateObj.getDate() - 1);
  }

  return Yup.object().shape({
    name: text({ required: true, min: 3, max: 100 }),

    startAt: datetime({
      required: true,
      start: startDateObj,
    }),

    endAt: datetime({ required: true }).when(
      "startAt",
      (startAtValue, schema) => {
        const startAt = Array.isArray(startAtValue)
          ? startAtValue[0]
          : startAtValue;

        if (startAt) {
          const startObj = new Date(startAt);

          if (isNaN(startObj.getTime()))
            return datetime({ required: true });

          const nextMinute = new Date(startObj);
          nextMinute.setMinutes(nextMinute.getMinutes() + 1);

          return datetime({
            required: true,
            start: nextMinute,
          });
        }

        return schema;
      }
    ),

    university: select({ required: true }),

    studentType: select({ required: true })
  });
};