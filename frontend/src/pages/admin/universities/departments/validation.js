import * as Yup from "yup";
import { text, select, checkbox } from "@/validation/fields";

export const departmentValidationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  faculty_id: select({ required: true }),
  is_visible: checkbox({ required: false })
});
