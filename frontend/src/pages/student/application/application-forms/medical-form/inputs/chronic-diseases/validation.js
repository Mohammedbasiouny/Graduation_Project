import * as Yup from "yup";
import { buildBooleanWithDetailsSchema } from "../validation";

export const QUESTIONS = [
  { key: "blood_pressure", withDetails: true },
  { key: "diabetes", withDetails: true },
  { key: "heart_disease", withDetails: true },
  { key: "immune_diseases", withDetails: true },
  { key: "mental_health", withDetails: true },
  { key: "other_diseases", withDetails: true },
];

export const validationSchema = Yup.object(
  buildBooleanWithDetailsSchema(QUESTIONS)
);