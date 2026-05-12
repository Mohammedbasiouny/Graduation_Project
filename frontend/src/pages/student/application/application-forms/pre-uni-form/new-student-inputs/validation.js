import * as Yup from "yup";
import {
  select,
  file,
  number,
  radio,
} from "@/validation/fields";

const baseSchema = ({requiredFiles = true, maxScore = 0}) => ({
  is_inside_egypt: radio({ required: true }),
  certificate_type: select({ required: true }),
  total_score: number({
    required: true,
    min: 1,
    max: maxScore !== 0 ? maxScore : 9999,
    integer: false
  }),
  percentage: number({ required: true, min: 1, max: 100, integer: false }),
  pre_university_certificate: file({
    required: requiredFiles,
    maxSize: 2,
    maxFiles: 5,
    allowedTypes: ["image/png", "image/jpeg", "image/jpg"],
  }),
});

export const inSideEgvalidationSchema = ({requiredFiles = true, maxScore = 0}) =>
  Yup.object().shape({
    ...baseSchema({requiredFiles, maxScore}),
    governorate: select({ required: true }),
    educational_administration: select({ required: true }),
  });

export const outSideEgvalidationSchema = ({requiredFiles = true, maxScore = 0}) =>
  Yup.object().shape({
    ...baseSchema({requiredFiles, maxScore}),
    certificate_country: select({ required: true }),
  });
