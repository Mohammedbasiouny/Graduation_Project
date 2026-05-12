import { file, name, ssn, text } from '@/validation/fields';
import * as Yup from 'yup';

export const validationSchema = ({ requiredFiles = true }) =>
  Yup.object().shape({
    national_id: ssn({ required: true }),
    full_name: name(),
    job_title: text({ required: true, min: 3, max: 50 }),
    relationship: text({ required: true, min: 2, max: 50 }),
    mobile_number: text({ required: true, min: 4, max: 50, allowSpaces: false, numbersOnly: true }),
    national_id_front_image: file({ required: requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
    national_id_back_image: file({ required: requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
});
