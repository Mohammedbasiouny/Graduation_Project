import * as Yup from 'yup';
import { checkbox, email, password } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  email: email({ required: true }),
  password: password({ required: true, minLength: 8 }),
  remember_me: checkbox({ required: false }),
});