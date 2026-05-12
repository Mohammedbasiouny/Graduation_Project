import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useLanguage } from "@/i18n/use-language.hook";

const OtpInput = ({
  length = 6,
  onChange,
  error = "",
  disabled = false,
  className = "",
}) => {
  const { currentLang } = useLanguage();
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Only numbers allowed

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChange?.(newValues.join(""));

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, length)
      .split("");

    const newValues = [...values];
    pasteData.forEach((v, i) => (newValues[i] = v));
    setValues(newValues);
    onChange?.(newValues.join(""));
  };

  // When disabled -> blur all
  useEffect(() => {
    if (disabled) inputsRef.current.forEach((input) => input?.blur());
  }, [disabled]);

  // When enabled -> focus the first empty input
  useEffect(() => {
    if (!disabled) {
      const firstEmptyIndex = values.findIndex((v) => v === "");
      const focusIndex = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
      inputsRef.current[focusIndex]?.focus();
    }
  }, [disabled, values, length]);

  return (
    <div
      className={clsx(
        "flex justify-center gap-2 sm:gap-3",
        currentLang === "ar" && "flex-row-reverse",
        className
      )}
      onPaste={handlePaste}
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled || (i > 0 && !values[i - 1])}
          className={clsx(
            "w-10 h-12 sm:w-12 sm:h-14 text-center text-lg md:text-xl font-semibold rounded-lg border focus:ring-[1px] transition-all duration-150 outline-none",
            "disabled:opacity-60 disabled:bg-(--gray-lightest) disabled:cursor-not-allowed",
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-(--gray-light) focus:ring-(--gold-main) focus:border-(--gold-main)",
            className
          )}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default OtpInput;
