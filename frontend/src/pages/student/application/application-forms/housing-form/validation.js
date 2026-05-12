import * as Yup from "yup";
import { select, radio } from "@/validation/fields";

export const validationSchema = Yup.object().shape({
  meals: radio({ required: true, type: "boolean" }),
  housing_type: select({ required: true }),
});
