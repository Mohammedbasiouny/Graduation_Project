import { file, name, select, text } from '@/validation/fields';
import * as Yup from 'yup';

export const validationSchema = ({ requiredFiles = true }) =>
  Yup.object().shape({
    identity_number: text({ required: true, min: 5, max: 50 }),
    full_name: name(),
    nationality: select({ required: true }),
    job_title: text({ required: true, min: 3, max: 50 }),
    relationship: text({ required: true, min: 5, max: 50 }),
    mobile_number: text({ required: true, min: 4, max: 50, allowSpaces: false, numbersOnly: true }),
    identity_image: file({ required: requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
});
