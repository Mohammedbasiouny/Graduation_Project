import { checkbox, number, text } from "@/validation/fields";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: text({ required: true, min: 2, max: 50 }),
  distance_from_cairo: number({ required: true, min: 0, max: 10000 }),
  is_visible: checkbox({ required: false }),
});
