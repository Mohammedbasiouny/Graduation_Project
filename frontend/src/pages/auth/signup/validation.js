import * as Yup from 'yup';
import { email, password, confirmPassword } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  email: email({ required: true }),
  password: password({ required: true, lowerCase: true, numbers: true, upperCase: true, specialChars: true, minLength: 8 }),
  confirm_password: confirmPassword({ required: true, refField: 'password' }),
});