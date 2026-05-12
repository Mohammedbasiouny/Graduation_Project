import axios from "axios";
import { useAuthStore } from "@/store/use-auth.store";
import i18n from "../i18n";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT),
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor: check token before sending any request
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();

    // If token exists, attach it to headers
    if (authStore?.token) {
      config.headers["Authorization"] = `Bearer ${authStore?.token}`;
      // If token is expired, logout and redirect
      if (authStore?.isTokenExpired()) {
        authStore?.logout();
        window.location.href = "/";
        return Promise.reject(new Error("Token expired"));
      }
    }

    // Attach current language
    config.headers["Accept-Language"] = i18n.language;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (!error?.response || error?.response?.status >= 500) {
      window.dispatchEvent(new Event("server-error"));
    }
    if (status == 429) {
      window.location.href = "/too-many-requests";
    }
    // Always reject so the caller can still catch it
    return Promise.reject(error);
  }
);

export default axiosInstance