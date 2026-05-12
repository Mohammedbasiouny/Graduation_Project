import { useUserStore } from "@/store/user.store";

const HasPermission = ({ permission, children }) => {
  const permissions = useUserStore((state) => state.permissions);

  const hasPermission = Array.isArray(permission)
    ? permission.some((p) => permissions.includes(p))
    : permissions.includes(permission);

  return hasPermission ? <>{children}</> : null;
};

export default HasPermission;
