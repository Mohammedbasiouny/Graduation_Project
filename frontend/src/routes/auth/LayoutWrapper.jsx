import { useAuthStore } from "@/store/use-auth.store";
import ProtectedRoute from "@/components/guards/ProtectedRoute"
import AuthLayout from "@/components/layouts/auth/AuthLayout";
import useScrollToTop from "@/hooks/use-scroll-to-top.hook";

export default function LayoutWrapper () {
  useScrollToTop("smooth");
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);

  const canAccess = isAuthenticated && !isTokenExpired();

  return (
    <ProtectedRoute isAllowed={!canAccess} redirectPath="/">
      <AuthLayout />
    </ProtectedRoute>
  );
};