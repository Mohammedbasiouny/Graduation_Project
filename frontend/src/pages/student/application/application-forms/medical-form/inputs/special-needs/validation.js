import * as Yup from "yup";
import { buildBooleanWithDetailsSchema } from "../validation";


export const QUESTIONS = [
  { key: "special_needs", withDetails: true },
];

export const validationSchema = Yup.object(
  buildBooleanWithDetailsSchema(QUESTIONS)
);