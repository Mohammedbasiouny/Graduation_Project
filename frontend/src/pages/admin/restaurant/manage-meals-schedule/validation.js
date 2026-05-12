import * as Yup from "yup";
import { select, text, datetime } from "@/validation/fields";

export const scheduleValidationSchema = Yup.object().shape({
  day_type: select({ required: true }),

  booking_start_time: datetime({ required: true }),

  booking_end_time: datetime({ required: true }),

  notes: text({ required: false, max: 500 }),
});


export const mealValidationSchema = Yup.object().shape({
  meal_id: select({ required: true }),

  delivery_start_time: datetime({ required: true }),

  delivery_end_time: datetime({ required: true }),
});


export const scheduleWithMealsValidationSchema = scheduleValidationSchema.shape({
  meals: Yup.array()
    .of(mealValidationSchema)
    .min(1, "At least one meal slot is required")
    .required(),
});