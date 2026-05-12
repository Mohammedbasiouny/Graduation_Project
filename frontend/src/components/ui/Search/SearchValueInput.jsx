import { useEffect, useState, useRef } from "react";
import { X, Search } from "lucide-react";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast.util";

const SearchValueInput = ({ className = "", debounceTime = 500, selectName, inputName }) => {
  const { t } = useTranslation();
  const { getParam, setParam, deleteParam } = useURLSearchParams();

  const [value, setValue] = useState("");
  const debounceTimeoutRef = useRef(null);

  // Load initial value from query param
  useEffect(() => {
    const paramValue = getParam(inputName, String);
    if (paramValue) setValue(paramValue);
  }, [getParam]);

  const handleImmediateChange = (text) => {
    const key = getParam(selectName, String);

    if (!key) {
      // Show toast
      showToast("warning", t("search.missing_key_toast"));
      return;
    }

    setValue(text);

    // Debounce updating query param
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (text.trim().length > 0) {
        setParam(inputName, text);
      } else {
        deleteParam(inputName);
      }
    }, debounceTime);
  };

  return (
    <div className={`bg-white relative flex items-center w-full ${className}`}>
      {/* Search icon */}
      <Search className="absolute ltr:left-3 rtl:right-3 text-gray-400 w-5 h-5 pointer-events-none" />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => handleImmediateChange(e.target.value)}
        placeholder={t("search.input_placeholder")}
        className="
          w-full rounded-lg border text-[16px] md:text-[18px] text-black placeholder-gray-400
          outline-none transition-all duration-150
          h-10.5 md:h-12.5
          px-10 py-2 md:px-10 md:py-3
          border-(--gray-light) focus:ring-(--gold-main) focus:border-(--gold-main)
        "
      />

      {/* Clear button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => handleImmediateChange("")}
          className="absolute ltr:right-3 rtl:left-3 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchValueInput;
