import { number, ssn } from '@/validation/fields'
import * as Yup from 'yup';

export const ssnValidationSchema = Yup.object().shape({
  ssn: ssn({ required: true }),
});
export const appNumValidationSchema = Yup.object().shape({
  application_number: number({ required: true, min: 1, integer: true }),
});