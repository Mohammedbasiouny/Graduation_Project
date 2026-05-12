import * as Yup from 'yup';
import { password, confirmPassword } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  newPassword: password({ required: true, lowerCase: true, numbers: true, upperCase: true, specialChars: true, minLength: 8 }),
  confirm_password: confirmPassword({ required: true, refField: 'newPassword' }),
});