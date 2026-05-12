import * as Yup from "yup";
import { select, radio } from "@/validation/fields";

export const validationSchema = Yup.object().shape({
  parents_status: select({ required: true }),
  family_residency_abroad: radio({ required: true, type: "boolean" }),
});
