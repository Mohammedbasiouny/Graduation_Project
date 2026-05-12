import { useTranslation } from "react-i18next";
import Heading from '@/components/ui/Heading'
import { Globe, Pyramid } from "lucide-react";
import { useGetCurrentPeriod, useGetPeriodStatus } from "../hooks";
import { useNavigate } from "react-router";
import LockedOverlay from "@/components/ui/LockedOverlay";
import { SelectableCard, SelectableCardSkeleton } from "@/components/ui/cards/SelectableCard";

const ChooseNationalityPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { currentPeriod, message, currentPeriodIsLoading } = useGetCurrentPeriod()
  const { periodStatus, periodStatusIsLoading } = useGetPeriodStatus()

  return (
    <div className='w-full flex flex-col items-center space-y-10 p-6 min-h-[60vh]'>
      <Heading 
        title={t("application-steps:choose_nationality.heading.title")}
        subtitle={t("application-steps:choose_nationality.heading.subtitle")}
      />

      <div
        className="lg:max-w-[90%] flex flex-wrap gap-8 items-stretch transition-all"
      >
        <>
          <p className="w-full text-lg font-black text-center text-red-800 tracking-wide animate-[pulseScale_1s_ease-in-out_infinite]">
            {message}
          </p>

          <style>
          {`
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.005); opacity: .9; }
          }
          `}
          </style>
        </>
        {currentPeriodIsLoading || periodStatusIsLoading ? (
          <>
            <SelectableCardSkeleton />
            <SelectableCardSkeleton />
          </>
        ) : (
          <div className="w-full flex gap-3 lg:gap-10 items-center">
            <LockedOverlay status={!periodStatus} message={t("egyptian.title")}>
              <SelectableCard
                title={t("egyptian.title")}
                description={t("egyptian.description")}
                icon={Pyramid}
                onClick={() => navigate(`/student/egyptian/application?step=student&current_period=${currentPeriod?.studentType}`)}
              />
            </LockedOverlay>

            <LockedOverlay status={!periodStatus} message={t("expatriate.title")}>
              <SelectableCard
                title={t("expatriate.title")}
                description={t("expatriate.description")}
                icon={Globe}
                onClick={() => navigate(`/student/expatriate/application?step=student&current_period=${currentPeriod?.studentType}`)}
              />
            </LockedOverlay>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseNationalityPage;
