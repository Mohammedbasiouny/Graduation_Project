import { Route } from "react-router";
import { lazy } from "react";
import LayoutWrapper from "./LayoutWrapper";

const LoginPage = lazy(() => import("../../pages/auth/login"));
const SignupPage = lazy(() => import("../../pages/auth/signup"));
const ChooseUniversityPage = lazy(() => import("../../pages/auth/choose-university"));
const ForgotPasswordPage = lazy(() => import("../../pages/auth/forgot-password"));
const CheckOtpPage = lazy(() => import("../../pages/auth/check-otp"));
const ResetPasswordPage = lazy(() => import("../../pages/auth/reset-password"));

// Array of auth routes
const authRouteConfig = [
  { path: "", element: <LoginPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
  { path: "choose-university", element: <ChooseUniversityPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "check-otp", element: <CheckOtpPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },
];

const AuthRoutes = (
  <Route path="auth" element={<LayoutWrapper />}>
    {authRouteConfig.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Route>
);

export default AuthRoutes;
