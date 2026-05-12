import { file, name, radio, select, ssn, text } from '@/validation/fields';
import * as Yup from 'yup';

export const validationSchema = ({ requiredFiles = true }) => {
  return Yup.object().shape({
    national_id: ssn({ required: true }),
    full_name: name(),
    religion: radio({ required: true, type: "string" }),
    birth_country: select({ required: false }).when('national_id', 
      (nationalId, schema) => {
        if (nationalId) {
            const showBirthPlace =
            nationalId.length >= 9 && nationalId.slice(7, 9) === "88";
          if (showBirthPlace) {
            return select({ required: true });
          }
          return select({ required: false });
        }
        return schema;
      }
    ),
    birth_city: text({ required: true }),
    mobile_number: text({ required: true, min: 4, max: 50, allowSpaces: false, numbersOnly: true }),
    landline_number: text({ required: false, min: 8, max: 10, allowSpaces: false, numbersOnly: true }),
    personal_image: file({ required:requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
    national_id_front_image: file({ required:requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
    national_id_back_image: file({ required:requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
  })
};