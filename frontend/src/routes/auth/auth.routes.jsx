import { Route } from "react-router";
import LayoutWrapper from "./LayoutWrapper";

import { CheckOtpPage, ChooseUniversityPage, ForgotPasswordPage, LoginPage, ResetPasswordPage, SignupPage } from "@/pages/auth"

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
