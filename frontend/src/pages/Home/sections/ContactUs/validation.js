import { email, name, text } from '@/validation/fields';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  full_name: name({ required: false, min: 3, max: 50 }),
  email: email({ required: true }),
  message_title: text({ required: true, min: 10, max: 50 }),
  message_content: text({ required: true, min: 10, max: 1000 }),
});