import * as Yup from "yup";
import { buildBooleanWithDetailsSchema } from "../validation";

export const QUESTIONS = [
  { key: "mental_health_treatment", withDetails: true },
  { key: "receiving_treatment", withDetails: true },
  { key: "allergies", withDetails: true },
];

export const validationSchema = Yup.object(
  buildBooleanWithDetailsSchema(QUESTIONS)
);