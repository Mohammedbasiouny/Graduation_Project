import { useTranslation } from 'react-i18next';
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import HU_logo from "@/assets/logos/HU_for_light_screen.png";
import HNU_logo from "@/assets/logos/HNU_for_light_screen.png";
import HITU_logo from "@/assets/logos/HITU_for_light_screen.png";
import { useAuthStore } from '@/store/use-auth.store';
import { useGetPeriodStatus } from '@/pages/student/application/hooks';

const TextCollage = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { periodStatus, isLoading } = useGetPeriodStatus()

  return (
    <div className="flex flex-col gap-6">

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
        {t("home:hero_section.headline_main")}
        <span className="block text-(--gold-dark)">
          {t("home:hero_section.headline_sub")}
        </span>
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-base sm:text-lg max-w-3xl leading-relaxed">
        {t("home:hero_section.description")}
      </p>

      {/* Logos */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
        <img src={HU_logo} alt="Capital University" className="h-15 sm:h-17 object-contain" />
        <img src={HNU_logo} alt="Capital National University" className="h-15 sm:h-17 object-contain" />
        <img src={HITU_logo} alt="Capital International Technological University" className="h-15 sm:h-17 object-contain" />
      </div>

      {!isLoading && (
        <div
          role="status"
          className={`w-fit inline-block px-4 py-2 rounded-lg border-2 font-medium text-base ${
            periodStatus
              ? "bg-(--green-lightest) text-(--green-dark) border-(--green-light)"
              : "bg-(--red-lightest) text-(--red-dark) border-(--red-light)"
          }`}
        >
          {t(`home:hero_section.period_status.${periodStatus}`)}
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 pt-2 max-lg:justify-center">
        <Link to={"/application-guide"}>
          <Button size="lg" variant="secondary">
            {t("application-guide:application_guide.btn")}
          </Button>
        </Link>
        {!isAuthenticated && (
          <Link to="/auth/choose-university">
            <Button variant="outline" size="lg">
              {t("home:hero_section.btn_create_account")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default TextCollage;
