import { date, file, name, radio, select, text } from '@/validation/fields';
import * as Yup from 'yup';

export const validationSchema = ({ requiredFiles = true }) => {
  return Yup.object().shape({
    passport_number: text({ required: true, min: 5, max: 50 }),
    passport_issuing_country: select({ required: true }),
    nationality: select({ required: true }),
    full_name: name(),
    date_of_birth: date({ required: true }),
    place_of_birth: text({ required: true }),
    gender: radio({ required: true, type: "string" }),
    religion: radio({ required: true, type: "string" }),
    mobile_number: text({ required: true, min: 4, max: 50, allowSpaces: false, numbersOnly: true }),
    personal_image: file({ required: requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
    passport_image: file({ required: requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
  })
};