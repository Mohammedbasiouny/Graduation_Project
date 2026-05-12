import * as Yup from 'yup';
import { email, name, select, ssn } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  national_id: ssn({ required: true }),
  email: email({ required: true }),
  full_name: name({ required: true }),
  role: select({ required: true }),
})