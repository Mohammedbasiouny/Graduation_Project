import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useLanguage } from "@/i18n/use-language.hook";
import { translateNumber } from "@/i18n/utils";
import { showToast } from "@/utils/toast.util";

const PageSizeSelect = ({ pageSize, name }) => {
  const { i18n } = useLanguage();
  const { getParam, setParam, deleteParam } = useURLSearchParams();
  const [value, setValue] = useState(null);

  const options = [
    { value: 5, label: translateNumber(5) },
    { value: 10, label: translateNumber(10) },
    { value: 20, label: translateNumber(20) },
    { value: 30, label: translateNumber(30) },
    { value: 40, label: translateNumber(40) },
    { value: 50, label: translateNumber(50) },
  ];

  // Initialize from query param
  useEffect(() => {
    const pageSizeParam = getParam(name, Number);
    if (pageSizeParam !== null) {
      setValue({
        value: pageSizeParam,
        label: String(translateNumber(pageSizeParam)),
      });
    }
  }, [name, getParam, i18n.language]);

  const handleChange = (selectedOption) => {
    setValue(selectedOption);

    if (selectedOption) {
      if (selectedOption.value >= 5 && selectedOption.value <= 100) {
        setParam(name, selectedOption.value);
      } else {
        showToast(
          "warning",
          i18n.t("fields:page_size.invalid_page_size")
        );
      }
    } else {
      deleteParam(name);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "8px",
      minHeight: "42px",
      height: "50px",
      borderColor: state.isFocused
        ? "var(--gold-main)"
        : "var(--gray-light)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--gold-main)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "var(--gold-main)" : "var(--gray-light)",
      },
      backgroundColor: "white",
      fontSize: "16px",
      transition: "all 0.15s ease-in-out",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 12px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0, color: "black" }),
    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--gold-main)"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
      padding: "10px 14px",
      cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, color: "black" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div className="w-40 flex flex-col gap-1">
      <CreatableSelect
        isClearable
        placeholder={i18n.t("fields:page_size.placeholder")}
        options={options}
        value={value}
        onChange={handleChange}
        styles={customStyles}
        defaultInputValue={translateNumber(pageSize)}
        className="w-full"
        classNamePrefix="react-select"
        menuPlacement="auto"
        menuPosition="fixed"
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default PageSizeSelect;
