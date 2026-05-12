import { useAuthStore } from "@/store/use-auth.store";
import ProtectedRoute from "@/components/guards/ProtectedRoute"
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import useScrollToTop from "@/hooks/use-scroll-to-top.hook";
import { useLayoutStore } from "@/store/use-layout.store";
import { useEffect } from "react";

export default function LayoutWrapper () {
  useScrollToTop("smooth");
  const { setShowBreadcrumbs } = useLayoutStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
  const { role } = useAuthStore((state) => state.user);

  const canAccess = isAuthenticated && !isTokenExpired() && role === "admin";

  useEffect(() => {
    setShowBreadcrumbs(true)
  }, [setShowBreadcrumbs])
  
  return (
    <ProtectedRoute isAllowed={canAccess} redirectPath="/">
      <AdminLayout />
    </ProtectedRoute>
  );
};