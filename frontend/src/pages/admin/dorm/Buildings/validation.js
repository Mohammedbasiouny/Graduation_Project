import { checkbox, number, select, text } from "@/validation/fields";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  type: select({ required: true }),
  floors_count: number({ required: true, min: 1, max: 100, integer: true }),
  is_available_for_stay: checkbox({ required: false }),
});