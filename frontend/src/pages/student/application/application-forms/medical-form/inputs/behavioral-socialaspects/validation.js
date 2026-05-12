import * as Yup from "yup";
import { buildBooleanWithDetailsSchema } from "../validation";

export const QUESTIONS = [
  { key: "adapt_to_new_environments", withDetails: false },
  { key: "prefer_solitude", withDetails: false },
  { key: "behavioral_problems", withDetails: false },
  { key: "suspension_history", withDetails: false },
  { key: "shared_room_adaptation", withDetails: false },
  { key: "social_support", withDetails: false },
  { key: "stimulants_or_sedatives", withDetails: false },
  { key: "social_media_usage", withDetails: false },
];

export const validationSchema = Yup.object(
  buildBooleanWithDetailsSchema(QUESTIONS)
);
