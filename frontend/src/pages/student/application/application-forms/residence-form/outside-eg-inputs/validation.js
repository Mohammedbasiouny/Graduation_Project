import { select, file, text } from "@/validation/fields";
import * as Yup from 'yup';

export const validationSchema = ({ requiredFiles = true }) => {
  return Yup.object().shape({
    country: select({ required: true }),
    detailed_address: text({ required: true, min: 5, max: 50 }),
    visa_or_residency_image: file({ required:requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
  })
};