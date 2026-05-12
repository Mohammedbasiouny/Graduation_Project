import { create } from "zustand";
import countriesData from "@/assets/data/countries.json";
import { translateNumber } from "@/i18n/utils";
import i18n from "@/i18n";

export const useCountriesStore = create((set, get) => ({
  countries: countriesData,

  setCountries: (newCountries) => set({ countries: newCountries }),


  getCountry: (
    identifier,
    valueKey = "code",
    labelKey = "name",
    withFlag = false,
    lang = i18n.language
  ) => {
    const { countries } = get();

    const country = countries.find(
      (c) =>
        c.code?.toLowerCase() === identifier?.toLowerCase() ||
        c.name?.toLowerCase() === identifier?.toLowerCase()
    );

    if (!country) return null;

    const value = country[valueKey];

    let label;
    if (labelKey === "name") {
      label =
        lang === "en" ? country.name_en || country.name : country.name_ar || country.name;
    } else if (labelKey === "dial_code") {
      const translatedDialCode = translateNumber(String(country.dial_code).slice(1), lang, false);
      label = lang === "en" ? "+" + translatedDialCode : translatedDialCode + "+";
    } else {
      label = country[labelKey];
    }

    const flag =
      withFlag && country.code
        ? country.code
            .toUpperCase()
            .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()))
        : "";

    return {
      value,
      label: withFlag
        ? lang === "en"
          ? `${flag} ${label}`
          : `${label} ${flag}`
        : label,
    };
  },

  getCountryOptions: (valueKey = "code", labelKey = "name", withFlag = false, lang = i18n.language) => {
    const { countries } = get();

    return countries.map((country) => {
      const value = country[valueKey];

      let label;
      if (labelKey === "name") {
        label = lang === "en" ? country.name_en || country.name : country.name_ar || country.name;
      } 
      else if (labelKey === "dial_code") {
        const translatedDialCode = translateNumber(String(country.dial_code).slice(1), lang, false)
        label = lang == "en" ? ("+" + translatedDialCode) : (translatedDialCode + "+");
      } 
      else {
        label = country[labelKey];
      }

      const flag =
        withFlag && country.code
          ? country.code
              .toUpperCase()
              .replace(/./g, (char) =>
                String.fromCodePoint(127397 + char.charCodeAt())
              )
          : "";

      return {
        value,
        label: withFlag
          ? lang === "en"
            ? `${flag} ${label}`
            : `${label} ${flag}`
          : label,
      };

    });
  },

  clearCountries: () => set({ countries: [] }),
}));
