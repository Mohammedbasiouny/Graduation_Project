import { select, file, number, gpa, text } from '@/validation/fields';
import * as Yup from 'yup';


export const validationSchema = ({ requiredFiles = true, isGPA = true}) =>
  Yup.object().shape({
  college: select({ required: true }),
  department_or_program: select({ required: true }),
  study_level: select({ required: true }),
  student_code: text({ required:false, min: 1 }),
  study_system_type: select({ required: true }),
  gpa_or_total_score: isGPA ? gpa({ required: true }) : number({ required:true, min: 1, max: 99999 }),
  enrollment_status: select({ required: true }),
  grade: select({ required: true }),
  enrollment_proof_image: file({ required: requiredFiles, maxSize: 2, allowedTypes: ["image/png", "image/jpeg", "image/jpg"] }),
});
