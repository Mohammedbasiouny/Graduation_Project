import * as Yup from "yup";
import { radio } from "@/validation/fields";

export const QUESTIONS = [
  'sadness_without_reason',
  'anxiety_or_stress',
  'concentration_difficulty',
  'sleep_problems',
  'loss_of_interest',
  'self_harm_thoughts',
  'appetite_changes',
  'anger_outbursts',
];

export const OPTIONS = ['always', 'sometimes', 'rarely', 'never'];

export const validationSchema = Yup.object(
  QUESTIONS.reduce((shape, key) => {
    shape[key] = radio({ required: true, type: "string" });

    return shape;
  }, {})
);