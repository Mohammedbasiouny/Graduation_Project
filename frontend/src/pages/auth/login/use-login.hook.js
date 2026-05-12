import { useState } from "react";
import { useTranslation } from "react-i18next";
import { applyFormServerErrors } from "@/utils/api.utils";
import { showToast } from "@/utils/toast.util";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/use-auth.store";
import { guestAuthService } from "@/services/auth";
import { decodeToken } from "@/utils/token.utils";

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const login = async (data, setError, openVerificationPopup) => {
    setLoading(true);

    try {
      const response = await guestAuthService.login(data);
      const status = response.status;

      if (status === 200) {
        const { access_token } = response.data.data;
        
        // Decode Token
        const decoded = decodeToken(access_token);
        if (!decoded) {
          showToast("error", t("messages:unexpected_error"))
          return;
        };

        const user = {
          id: decoded.sub,
          name: decoded.name || null,
          role: decoded.role,
          university: decoded.university,
          permissions: decoded.permissions || [],
        };

        const expiresAt = decoded.exp * 1000;

        setAuth({
          token: access_token,
          expiresAt,
          id: user.id,
          name: user.name,
          role: user.role,
          university: user.university,
          permissions: user.permissions,
        });
        
        showToast("success", t("auth:login_page.messages.logged_in_successfully"));
        if (user.role === "student") {
          setTimeout(() => navigate("/student"), 500);
        }
        if (user.role === "admin") {
          setTimeout(() => navigate("/admin"), 500);
        }
      } else if (status === 401) {
        showToast("error", t("auth:login_page.messages.invalid_credentials"));
      } else if (status === 403) {
        showToast("warning", t("auth:login_page.messages.email_not_verified"));
        openVerificationPopup(data.email);
      } else if (status === 422) {
        applyFormServerErrors(response.data.errors, setError);

      } else {
        showToast("error", t("messages:unexpected_error"));
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("error", t("messages:network_error"));
      logout();
    } finally {
      setLoading(false);
    }
  };

  return { 
    login, 
    loading 
  };
};

