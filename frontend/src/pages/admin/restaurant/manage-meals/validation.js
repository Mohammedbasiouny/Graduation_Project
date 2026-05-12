import { checkbox, select, text } from "@/validation/fields";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  category: select({ required: true }),
  description: text({ required: false, min: 10, max: 255 }),
  is_active: checkbox({ required: false }),
});