import * as Yup from 'yup';
import { email, text } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  new_email: email({ required: true }),
});