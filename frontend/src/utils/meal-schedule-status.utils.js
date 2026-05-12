import i18n from "@/i18n";

export const getMealScheduleStatus = (mealSchedule) => {
  if (!mealSchedule) return null;

  const now = new Date();

  const bookingStart = new Date(mealSchedule?.booking_start_time);
  const bookingEnd = new Date(mealSchedule?.booking_end_time);

  // ❌ invalid dates guard
  if (
    isNaN(bookingStart.getTime()) ||
    isNaN(bookingEnd.getTime())
  ) {
    return null;
  }

  // ⏳ Booking not started
  if (now < bookingStart) {
    return {
      status: i18n.t("meals-schedule:status.booking_not_started"),
      variant: "warning",
    };
  }

  // ✅ Booking open
  if (now >= bookingStart && now <= bookingEnd) {
    return {
      status: i18n.t("meals-schedule:status.booking_open"),
      variant: "success",
    };
  }

  // 🔒 Booking closed
  if (now > bookingEnd) {
    return {
      status: i18n.t("meals-schedule:status.booking_closed"),
      variant: "error",
    };
  }

  return null;
};