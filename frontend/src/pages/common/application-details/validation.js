import { checkbox, number, select, text } from "@/validation/fields";
import * as Yup from "yup";

export const resultValidationSchema = Yup.object().shape({
  security_result_inquiry: select({ required: true }),
  candidate_for_final_acceptance: select({ required: true }),
  final_acceptance: select({ required: true }),
  message_to_student: text({ required: true, min: 10, max: 255 }),
});

export const allocationValidationSchema = Yup.object().shape({
  building_type: select({ required: true }),
  building_id: select({ required: true }),
  floor: number({ required: true, min: 1, max: 100, integer: true }),
  room_type: select({ required: true }),
  room_id: select({ required: true }),
  notes: text({ required: false, min: 2, max: 255 }),
});