import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '../../../ui/Button';
import { useAuthStore } from "@/store/use-auth.store"
import { Flyout, FlyoutItem } from "../../../ui/Flyout";
import { LogIn, UserIcon, UserPlus } from "lucide-react";

const GuestButtons = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { t } = useTranslation();

  return (
    !isAuthenticated && (
      <>
        <div className="hidden lg:flex items-center gap-3">
          <Link to={"/auth/login"}>
            <Button variant="secondary" size="sm">
              {t("buttons:login")}
            </Button>
          </Link>
          <Link to={"/auth/choose-university"}>
            <Button variant="outline-white" size="sm">
              {t("buttons:signup")}
            </Button>
          </Link>
        </div>

        <div className='lg:hidden block'>
          <Flyout
            className="p-2 focus:outline-none cursor-pointer bg-(--gold-main) rounded-full"
            icon={<UserIcon className="text-white" />}
          >
            <div className="bg-white shadow-lg rounded-[10px] p-3 w-70 border border-gray-100 flex flex-col gap-3">
              <FlyoutItem
                Icon={LogIn}
                title={t("header:login.title")}
                description={t("header:login.description")}
                bg="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                to="/auth/login"
              />

              <FlyoutItem
                Icon={UserPlus}
                title={t("header:signup.title")}
                description={t("header:signup.description")}
                bg="bg-gray-100 hover:bg-gray-200"
                textColor="text-gray-700"
                to="/auth/choose-university"
              />
            </div>
          </Flyout>
        </div>
      </>
    )
  )
}

export default GuestButtons
