import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { translateNumber } from "@/i18n/utils";
import useCollapsible from "@/hooks/use-collapsible.hook";

const ApplicationStatusCard = ({ completedSteps }) => {
  const { t } = useTranslation();

  // Define all possible steps
  const allSteps = [
    { key: "personalInfoCompleted", labelKey: "personal" },
    { key: "residenceInfoCompleted", labelKey: "residence" },
    { key: "preUniEduCompleted", labelKey: "pre_uuni_edu" },
    { key: "academicInfoCompleted", labelKey: "academic" },
    { key: "guardianInfoCompleted", labelKey: "guardian" },
    { key: "parentsStatusCompleted", labelKey: "parents_status" },
    { key: "medicalInfoCompleted", labelKey: "medical" },
    { key: "housingInfoCompleted", labelKey: "housing" },
  ];

  // Filter only existing steps
  const steps = allSteps.filter((step) =>
    Object.prototype.hasOwnProperty.call(completedSteps, step.key)
  );

  const {
    collapsed,
    toggle,
    contentRef,
    maxHeight,
  } = useCollapsible(false, [steps]);

  // Calculate progress
  const completedCount = steps.filter((step) => completedSteps[step.key]).length;
  const totalSteps = steps.length;
  const progress = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;

  if (!completedSteps) return null;

  return (
    <section className="h-fit bg-white rounded-2xl shadow-md p-5 space-y-3 transition">
      {/* Header with toggle */}
      <div
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={toggle}
      >
        <h2 className="text-lg font-semibold text-gray-800">
          {t("track-application:completed_steps.title")}
        </h2>
        <div className="text-gray-500 transition-transform duration-300">
          {collapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Progress Bar (always visible) */}
      <div className="space-y-1">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {progress !== 0 ? translateNumber(progress) : t("zero")}% {t("track-application:completed_steps.completed")}
        </p>
      </div>

      {/* Collapsible Steps */}
      <div
        ref={contentRef}
        style={{ maxHeight: maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="space-y-2 mt-2">
          {steps.map((step) => {
            const completed = completedSteps[step.key];
            return (
              <div
                key={step.key}
                className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                {/* Step Label */}
                <span className="text-gray-800">
                  {t(`track-application:completed_steps.${step.labelKey}`)}
                </span>

                {/* Status Icon in Circle */}
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${
                    completed ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {completed ? (
                    <Check className="text-green-600 w-3 h-3" />
                  ) : (
                    <X className="text-red-600 w-3 h-3" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ApplicationStatusCard;