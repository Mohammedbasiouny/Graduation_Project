import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import useURLSearchParams from "@/hooks/use-URL-search-params.hook";
import { useLanguage } from "@/i18n/use-language.hook";

const SearchKeySelect = ({ fields, selectName }) => {
  const { i18n } = useLanguage();
  const { getParam, setParam, deleteParam } = useURLSearchParams();

  const [value, setValue] = useState(null);

  // Convert object → select options
  const options = useMemo(() => {
    return Object.entries(fields).map(([key, label]) => ({
      value: key,
      label,
    }));
  }, [fields]);

  // Initialize value from query params
  useEffect(() => {
    const searchKey = getParam(selectName, String);
    if (searchKey && fields[searchKey]) {
      setValue({ value: searchKey, label: fields[searchKey] });
    }
  }, [getParam, fields]);

  // Handle select changes
  const handleChange = (selected) => {
    setValue(selected);
    if (selected) {
      setParam(selectName, selected.value);
    } else {
      deleteParam(selectName);
    }
  };

  // Styling (matches your PageSizeSelect)
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "8px",
      minHeight: "42px",
      height: "46px",
      borderColor: state.isFocused ? "var(--gold-main)" : "var(--gray-light)",
      boxShadow: state.isFocused ? "0 0 0 1px var(--gold-main)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "var(--gold-main)" : "var(--gray-light)",
      },
      backgroundColor: "white",
      fontSize: "15px",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 10px" }),
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
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div className="w-52 flex flex-col gap-1">
      <Select
        isClearable
        placeholder={i18n.t("search.select_placeholder")}
        options={options}
        value={value}
        onChange={handleChange}
        styles={customStyles}
        className="w-full"
        classNamePrefix="react-select"
        menuPlacement="auto"
        menuPosition="fixed"
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default SearchKeySelect;
