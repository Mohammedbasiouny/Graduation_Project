import { checkbox, select, text } from "@/validation/fields";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  governorate_id: select({ required: true }),
  is_visible: checkbox({ required: false }),
  acceptance_status: checkbox({ required: false }),
});