import React, { useState } from "react";
import Heading from "@/components/ui/Heading";
import { useTranslation } from "react-i18next";
import StepCard from "./StepCard";
import { translateNumber } from "@/i18n/utils";

const ApplicationGuidePage = () => {
  const { t } = useTranslation();
  const steps = t("application-guide:application_guide.steps", { returnObjects: true });
  const [activeStep, setActiveStep] = useState(0); // default first step

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Heading */}
      <Heading
        title={t("application-guide:application_guide.title")}
        subtitle={t("application-guide:application_guide.subtitle")}
      />

      {/* Two-column layout */}
      <div className="mt-10 flex flex-col lg:flex-row gap-8">
        
        {/* Steps Column */}
        <div className="lg:w-96 shrink-0 space-y-3 h-fit pr-2">
          <Heading
            title={t("application-guide:application_guide.section_title")}
            subtitle={t("application-guide:application_guide.section_subtitle")}
            size="sm"
            align="start"
          />
          {steps.map((step, idx) => (
            <StepCard
              key={idx}
              step={translateNumber(idx+1)}
              title={step.title}
              isActive={activeStep === idx}
              onClick={() => setActiveStep(idx)}
            />
          ))}
        </div>

        {/* Video + Step Details Column */}
        <div className="flex-1 space-y-6 lg:sticky lg:top-20">
          {/* Video */}
          <div className="aspect-video w-full rounded-xl shadow-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/HYJoodnyCFc?si=ccHywO63Mbw-S_mv"
              title="Application Guide Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Active Step Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
            <h3 className="text-gray-900 text-lg sm:text-xl md:text-2xl font-semibold mb-3">
              {translateNumber(activeStep+1)} - {steps[activeStep].title}
            </h3>
            <p
              className="whitespace-pre-wrap wrap-break-word text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: steps[activeStep].text.replace(
                  /<mark>(.*?)<\/mark>/g,
                  `<mark class="bg-gray-200 text-gray-900 px-1 rounded">${"$1"}</mark>`
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationGuidePage;