import { select, file, number } from '@/validation/fields';
import * as Yup from 'yup';

export const validationSchema = ({ requiredFiles = true }) =>
  Yup.object().shape({
  college: select({ required: true }),
  department_or_program: select({ required: true }),
  admission_year: number({ required:true, min: 1980, max: new Date().getFullYear() }),
  nomination_card_image: file({ required: requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
});