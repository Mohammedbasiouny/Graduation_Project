import clsx from "clsx";
import { Button } from "../ui/Button";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Rocket, Clock } from "lucide-react";

const ComingSoonScreen = ({ className = "" }) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center px-6 md:px-10 py-20 gap-6 animate-fade-in",
        className
      )}
    >
      {/* Animated Icon */}
      <div className="animate-pulse-slow">
        <Rocket className="w-32 h-32 text-(--primary-dark)" />
      </div>

      {/* Title */}
      <h1 className="text-5xl sm:text-6xl font-extrabold text-(--primary-dark) animate-fade-up">
        {t("coming_soon.title")}
      </h1>

      {/* Subtitle */}
      <p className="max-w-lg text-lg sm:text-xl text-(--gray-dark) animate-fade-up delay-100">
        {t("coming_soon.subtitle")}
      </p>

      {/* Extra Info */}
      <div className="flex flex-col gap-2 max-w-xl text-gray-700 animate-fade-up delay-200">
        <p>
          🔹 {t("coming_soon.under_development")}
        </p>
        <p>
          🔹 {t("coming_soon.content")}
        </p>
        <p className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" /> {t("coming_soon.thanks")}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link to={"/"}>
          <Button>{t("buttons:back_to_home")}</Button>
        </Link>
        <div onClick={() => window.location.reload()}>
          <Button variant="outline">{t("buttons:refresh_page")}</Button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }

        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulseSlow 2s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default ComingSoonScreen;