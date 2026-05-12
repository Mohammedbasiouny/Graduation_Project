# i18n

This folder contains the **internationalization (i18n) setup** for the application, including configuration for `i18next` and a custom React hook to manage language changes dynamically.

It supports **English (`en`)** and **Arabic (`ar`)**, with automatic language detection, namespace management, and RTL/LTR layout adjustments.

---

## 📁 Folder Structure

```
i18n/
├── index.js                # i18next initialization and configuration
├── use-language.hook.js    # Custom React hook for language management
└── utils/                  # Utility functions (e.g., formatting numbers, dates, time)
```

---

## 📄 File Overview

---

### `index.js`

#### Description

This file initializes **i18next** with:

* React integration (`initReactI18next`)
* HTTP backend for loading translation JSON files
* Language detection using browser and localStorage
* Preloaded namespaces and supported languages
* Fallback language configuration

#### Features

* Supports `en` and `ar` languages
* Automatic detection of user language
* Preloads essential namespaces like `common`, `buttons`, `validations`, etc.
* Handles dynamic loading of translation JSON files via `i18next-http-backend`
* Sets up fallback language and default namespace

#### Example

```js
import i18n from "@/i18n";

i18n.changeLanguage("ar"); // switch to Arabic
```

---

### `use-language.hook.js`

#### Description

A **custom React hook** to manage language changes in the app.

#### Features

* Updates the `<html>` tag attributes:

  * `lang` attribute (`en` / `ar`)
  * `dir` attribute (`ltr` / `rtl`)
  * Font classes (`font-en` / `font-ar`)
* Provides a `changeLanguage` function to switch languages dynamically
* Checks for missing namespaces and logs warnings if any are missing
* Returns useful properties for components:

  * `currentLang`: current active language
  * `isArabic`: boolean flag if language is Arabic
  * `dir`: text direction
  * `i18n`: the i18next instance
  * `changeLanguage`: function to switch languages

#### Usage Example

```js
import { useLanguage } from "@/i18n/use-language.hook";

function LanguageSwitcher() {
  const { currentLang, changeLanguage, isArabic } = useLanguage();

  return (
    <button onClick={() => changeLanguage(currentLang === "ar" ? "en" : "ar")}>
      Switch to {isArabic ? "English" : "Arabic"}
    </button>
  );
}
```

---

### `utils/` Folder

#### Description

Contains **utility functions** for i18n, such as:

* Translating numbers, dates, and times
* Formatting according to the current language
* Handling Arabic digit conversion and locale-aware formatting

> See the README in `utils/` for details on individual functions.

---

## 🔧 Configuration Details

* **Supported languages**: `en`, `ar`
* **Default language**: `ar` or fallback from environment variable `VITE_DEFAULT_LANG`
* **Language storage**: `localStorage` key `i18nextLng` or `VITE_I18N_LANGUAGE_STORAGE_KEY`
* **Namespaces**: multiple namespaces for different parts of the application
* **Backend load path**: `/locales/{{lng}}/{{ns}}.json`

---

## ✅ Best Practices

* Always use `useLanguage` hook for language-sensitive components
* Preload all namespaces that are frequently accessed
* Store user preference in `localStorage` for persistent language selection
* Use `dir` and `isArabic` from hook to adjust UI layouts dynamically

---

## 🔒 Error Handling

* Logs warnings if translation namespaces are missing for the selected language
* Gracefully falls back to the default language if translations are unavailable

---

## 📦 Usage

```js
import i18n from "@/i18n";
import { useLanguage } from "@/i18n/use-language.hook";

// Example: Switching language programmatically
i18n.changeLanguage("en");

// Example: Using the hook in a component
const { currentLang, dir, changeLanguage } = useLanguage();
```

---