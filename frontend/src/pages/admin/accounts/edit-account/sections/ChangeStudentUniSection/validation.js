import * as Yup from 'yup';
import { email, name, select, ssn } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  university: select({ required: true }),
})