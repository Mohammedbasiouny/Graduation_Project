import * as Yup from 'yup';
import { email } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  email: email({ required: true }),
});