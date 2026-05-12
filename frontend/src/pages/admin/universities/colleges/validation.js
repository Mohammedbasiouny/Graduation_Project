import * as Yup from "yup";
import { text, select, checkbox } from "@/validation/fields";

export const collegeValidationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  university: select({ required: true }),
  is_off_campus: select({ required: true }),
  is_visible: checkbox({ required: false })
});
