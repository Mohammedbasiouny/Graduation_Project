import { checkbox, time } from "@/validation/fields";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  restaurant_status: checkbox({ required: false }),
  application_period_open: checkbox({ required: false }),
  auto_meal_reserve: checkbox({ required: false }),
  admission_results_announced: checkbox({ required: false }),
  university_housing_started: checkbox({ required: false }),
  female_visits_available: checkbox({ required: false }),
  online_payment_available: checkbox({ required: false }),
  attendance_start: time({ required: true }),
  attendance_end: time({ required: true }),
});
