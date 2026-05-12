# i18n Utils

A lightweight internationalization (i18n) utility module for **formatting and translating dates, numbers, and time values**, with built-in support for **Arabic numerals (٠١٢٣٤٥٦٧٨٩)** and English formatting.

This module is designed to be **framework-agnostic** and can be used in **React, Vue, Laravel Blade, Node.js, or any JavaScript environment**.

---

## 📁 Folder Structure

```
i18n/
└── utils/
    ├── constants.js
    ├── translate-date.js
    ├── translate-number.js
    ├── translate-time.js
    └── index.js
```

---

## 📌 Purpose

The goal of these utilities is to:

* Convert **Western digits (0–9)** into **Arabic digits (٠–٩)**
* Format **dates** into `DD-MM-YYYY`
* Format **numbers** with locale-aware separators
* Handle **special cases** like phone numbers or IDs that start with `0`
* Provide a **single export entry point** for clean imports

---

## 📄 File Overview

---

## `constants.js`

### Description

Defines shared constants used across all translation utilities.

### Code

```js
export const AR_DIGITS = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
```

### Usage

* Maps Western digits (`0–9`) to Arabic numerals.
* Used by all translation functions via digit replacement.

---

## `translate-date.js`

### Description

Translates and formats date strings from **ISO format** (`YYYY-MM-DD`) into `DD-MM-YYYY`, with optional Arabic digit conversion.

### Function Signature

```js
translateDate(value, lang = i18n.language)
```

### Parameters

| Name    | Type     | Default         | Description                        |
| ------- | -------- | --------------- | ---------------------------------- |
| `value` | `string` | —               | Date string in `YYYY-MM-DD` format |
| `lang`  | `string` | `i18n.language` | Language (`"ar"` or `"en"`)        |

---

### Behavior

* Accepts only valid ISO date strings
* Reformats date to `DD-MM-YYYY`
* Converts digits to Arabic if `lang === "ar"`
* Returns original value if input is invalid

---

### Examples

```js
translateDate("2025-12-24");
// "٢٤-١٢-٢٠٢٥"

translateDate("2025-12-24", "en");
// "24-12-2025"

translateDate("invalid-date");
// "invalid-date"
```

---

## `translate-number.js`

### Description

Formats numeric values with locale support and optional Arabic digit translation.

Designed to correctly handle:

* Large numbers
* Decimals
* Phone numbers and IDs starting with `0`

---

### Function Signature

```js
translateNumber(value, lang = i18n.language, formatted = true)
```

### Parameters

| Name        | Type               | Default         | Description                 |
| ----------- | ------------------ | --------------- | --------------------------- |
| `value`     | `number \| string` | —               | Value to translate          |
| `lang`      | `string`           | `i18n.language` | Language (`"ar"` or `"en"`) |
| `formatted` | `boolean`          | `true`          | Enable locale formatting    |

---

### Formatting Rules

#### ✅ `formatted = true`

* Uses `Intl.NumberFormat`
* Adds thousands separators
* Preserves leading zero values (e.g. phone numbers)

#### ❌ `formatted = false`

* No separators
* Converts digits manually
* Keeps exact input format

---

### Examples

```js
translateNumber(555555);
// "٥٥٥٬٥٥٥"

translateNumber(555555, "en");
// "555,555"

translateNumber("01141074546", "ar", false);
// "٠١١٤١٠٧٤٥٤٦"

translateNumber("01141074546", "ar", true);
// "11,410,745,46" (not recommended for phone numbers)
```

> 💡 **Tip:**
> Use `formatted = false` for phone numbers, IDs, or codes.

---

## `translate-time.js`

### Description

Handles time-related numeric values (hours, minutes, durations) using **24-hour input (`HH:mm`)**, with optional 12-hour formatting and Arabic digit translation.

---

### Function Signature

```js
translateTime(value, lang = i18n.language, formatted = true)
```

### Examples

```js
translateTime("12:30", "ar", false);
// "١٢:٣٠"

translateTime("14:00", "en");
// "02:00 PM"

translateTime("23:15");
// "١١:١٥ م"  (assuming i18n.language = "ar")
```

---

## `index.js`

### Description

Central export file to simplify imports.

### Code

```js
import { translateDate } from './translate-date';
import { translateNumber } from './translate-number';
import { translateTime } from './translate-time';

export {
  translateDate,
  translateNumber,
  translateTime
};
```

---

### Usage

```js
import {
  translateDate,
  translateNumber,
  translateTime
} from "@/i18n/utils";

// Automatic language from i18n
translateDate("2025-12-24");
translateNumber(555555);
translateTime("14:00");
```

---

## 🔒 Error Handling

All utilities:

* Use `try/catch`
* Fail silently
* Return the original value if formatting fails
* Log warnings for debugging

---