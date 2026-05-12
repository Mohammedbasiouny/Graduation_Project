import { Bounce, toast } from "react-toastify";
import i18n from "@/i18n"; // adjust import path to your i18n instance

export const showToast = (type, message, time = 10000) => {
  const isRTL = i18n.language === "ar";

  toast[type](message, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
    rtl: isRTL,
    className: isRTL ? "font-ar" : "font-en",
  });
};
