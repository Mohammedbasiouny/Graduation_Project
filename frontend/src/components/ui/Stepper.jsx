import clsx from "clsx";
import { Check, Circle } from "lucide-react";
import Tooltip from "./Tooltip";
import { translateNumber } from "@/i18n/utils";
import { useLanguage } from "@/i18n/use-language.hook";
import { truncateText } from "@/utils/format-text.utils";

const Stepper = ({ steps = [], onStepChange = null }) => {
  const { currentLang } = useLanguage()
  return (
    <div className="w-full flex flex-col items-center">

      {/* Steps Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-center gap-4">
        {steps.map((step, index) => {

          return (
            <div key={index} className="flex-1 max-w-60">
              <div
                className={clsx(
                  "flex items-center gap-3 cursor-pointer transition-all",
                  step.isActive && "text-(--blue-dark) font-semibold",
                  step.isCompleted && "text-(--green-dark)"
                )}
                onClick={() => onStepChange?.(index)}
              >
                {/* Circle */}
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                    step.isCompleted
                      ? "bg-(--green-dark) border-(--green-dark) text-white"
                      : step.isActive
                      ? "border-(--blue-dark) text-(--blue-dark)"
                      : "border-(--gray-dark) text-(--gray-dark)"
                  )}
                >
                  {step.isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : step.isActive ? (
                    <Circle className="w-5 h-5 text-(--blue-dark)" />
                  ) : (
                    <span className="text-(--gray-dark)">{translateNumber(index + 1, currentLang)}</span>
                  )}
                </div>


                {/* Label */}
                <Tooltip content={step.title}>
                  <span className="text-sm sm:text-base">{truncateText(step.title, 20)}</span>
                </Tooltip>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-full h-0.5 bg-(--gray-light) my-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
