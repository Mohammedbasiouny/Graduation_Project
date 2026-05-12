import * as Yup from 'yup';
import { password, confirmPassword } from '@/validation/fields';

export const validationSchema = Yup.object().shape({
  old_password: password({ required: true }),
  new_password: password({ required: true, lowerCase: true, numbers: true, upperCase: true, specialChars: true, minLength: 8 }),
  confirm_password: confirmPassword({ required: true, refField: 'new_password' }),
});