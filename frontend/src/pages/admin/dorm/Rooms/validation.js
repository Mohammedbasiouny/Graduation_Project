import { checkbox, number, select, text } from "@/validation/fields";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  type: select({ required: true }),
  building_id: select({ required: true }),
  floor: number({ required: true, min: 1, max: 100, integer: true }),
  capacity: number({ required: true, min: 1, max: 100, integer: true }),
  description: text({ required: false, min: 2, max: 255 }),
  is_available_for_stay: checkbox({ required: false }),
});