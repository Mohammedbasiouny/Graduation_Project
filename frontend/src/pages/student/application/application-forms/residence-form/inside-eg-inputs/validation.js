import { select, text } from "@/validation/fields";
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  governorate: select({ required: true }),
  district_or_center: select({ required: true }),
  city_or_village: select({ required: true }),
  detailed_address: text({ required: true, min: 5, max: 50 }),
});
