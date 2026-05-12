import i18n from "@/i18n";
import { translateDate, translateTime } from "@/i18n/utils";
import { formatToDateOnly, formatToTimeOnly } from "./format-date-and-time.utils";

export const getPeriodStatus = ({ startAt, endAt }) => {
  const now = new Date();
  const start = new Date(startAt);
  const end = new Date(endAt);

  let status;
  if (now < start) status = 'upcoming';
  else if (now > end) status = 'ended';
  else status = 'available';

  let variant;
  switch (status) {
    case 'available':
      variant = 'success';
      break;
    case 'upcoming':
      variant = 'info';
      break;
    case 'ended':
      variant = 'error';
      break;
    default:
      variant = 'default';
  }
  
  const label = i18n.t(`application-dates:date_status.${status}`);

  return { label, status, variant };
};

export const getPeriodDetails = ({
  startAt,
  endAt,
  name,
  university,
  studentType
}) => {
  return i18n.t("application-dates:table.period_details", {
    start_date: `${translateDate(formatToDateOnly(startAt))}  -  ${translateTime(formatToTimeOnly(startAt))}`,
    end_date: `${translateDate(formatToDateOnly(endAt))}  -  ${translateTime(formatToTimeOnly(endAt))}`,
    who_can_apply: name,
    university: university,
    student_type: studentType,
  });
};