import { useTranslation } from 'react-i18next';
import { useAuthStore } from "@/store/use-auth.store"
import { Flyout, FlyoutItem } from "../../../ui/Flyout";
import { Layers, LayoutDashboard, LogOut, User, UserIcon } from "lucide-react";
import { Link } from 'react-router';
import { Button } from '@/components/ui/Button';
import { useMediaQuery } from '@/hooks/use-media-query.hook';

const AuthButtons = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { t } = useTranslation();

  return (
    isAuthenticated && (
      <>
        <div className='flex items-center gap-3'>
          <Flyout
            className="p-2 focus:outline-none cursor-pointer bg-(--gold-main) rounded-full"
            icon={<UserIcon className="text-white" />}
          >
            <div className="bg-white shadow-lg rounded-[10px] p-3 w-70 border border-gray-100 flex flex-col gap-3">
              <FlyoutItem
                Icon={User}
                title={t("header:profile.title")}
                description={t("header:profile.description")}
                bg="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                to={`/${user?.role}/me`}
              />

              {user?.role === "admin" && (
                <FlyoutItem
                  Icon={LayoutDashboard}
                  title={t("header:dashboard.title")}
                  description={t("header:dashboard.description")}
                  bg="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  to="/admin/dashboard"
                />
              )}

              {user?.role === "student" && (
                <FlyoutItem
                  Icon={Layers}
                  title={t("header:services.title")}
                  description={t("header:services.description")}
                  bg="bg-gray-100 hover:bg-gray-200"
                  textColor="text-gray-700"
                  to="/student/portal"
                />
              )}

              <FlyoutItem
                Icon={LogOut}
                title={t("header:logout.title")}
                description={t("header:logout.description")}
                bg='bg-red-100 hover:bg-red-200'
                textColor="text-(--red-dark)"
                onClick={() => logout()}
              />
            </div>
          </Flyout>
          {isDesktop && (
            <>
              {user?.role === "student" && (
                <Link to={"/student/portal"}>
                  <Button variant="outline-white" size="sm">
                    {t("header:services.title")}
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </>
    )
  )
}

export default AuthButtons
