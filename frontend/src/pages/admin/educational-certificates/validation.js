import * as Yup from "yup";
import { checkbox, number, text } from "@/validation/fields";

export const validationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  degree: number({ required: true, min: 0, max: 9999 }),
  is_visible: checkbox({ required: false }),
  notes: text({ required: false, min: 10, max: 255 }),
});
