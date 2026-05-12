import { forwardRef, memo, useMemo } from "react";
import Select from "react-select";
import clsx from "clsx";
import ErrorText from "../ErrorText";

const SelectBox = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = "",
      className = "",
      error = "",
      options = [],
      disabled = false,
      isClearable = false,
      returnObject = false, // 🔥 NEW PROP
    },
    ref
  ) => {

    const customStyles = {
      control: (base, state) => ({
        ...base,
        borderRadius: "8px",
        minHeight: "42px",
        height: "50px",
        borderColor: error
          ? "#ef4444"
          : state.isFocused
          ? "var(--gold-main)"
          : "var(--gray-light)",
        boxShadow: state.isFocused ? "0 0 0 1px var(--gold-main)" : "none",
        "&:hover": {
          borderColor: state.isFocused
            ? "var(--gold-main)"
            : "var(--gray-light)",
        },
        backgroundColor: disabled ? "var(--gray-lightest)" : "white",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "default",
        transition: "all 0.15s ease-in-out",
        fontSize: "16px",
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
      menu: (base) => ({ ...base, borderRadius: "8px", overflow: "hidden" }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    /**
     * 🔥 Determine selected option
     * - If value is object → use directly
     * - If value is primitive → find in options
     */
    const selectedOption = useMemo(() => {
      if (!value) return null;

      if (typeof value === "object" && value.value !== undefined) {
        return value;
      }

      return options.find((opt) => opt.value == value) || null;
    }, [value, options]);

    /**
     * 🔥 Handle change
     * - If returnObject → return full option
     * - Else → return only value
     */
    const handleChange = (selected) => {
      if (!selected) {
        onChange(returnObject ? null : "");
        return;
      }

      onChange(returnObject ? selected : selected.value);
    };

    return (
      <div className="w-full flex flex-col gap-1">
        <Select
          ref={ref}
          isDisabled={disabled}
          placeholder={placeholder}
          options={options}
          value={selectedOption}
          onChange={handleChange}
          styles={customStyles}
          className={clsx("w-full", className)}
          classNamePrefix="react-select"
          menuPortalTarget={
            typeof document !== "undefined" ? document.body : null
          }
          isClearable={isClearable}
        />

        {error && <ErrorText error={error} />}
      </div>
    );
  }
);

SelectBox.displayName = "SelectBox";

export default memo(SelectBox);