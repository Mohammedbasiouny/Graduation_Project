import * as Yup from "yup";
import i18n from "@/i18n";
import { translateNumber } from "@/i18n/utils";

export const file = ({
  required = true,
  allowedTypes = [],
  maxSize = null, // MB
  maxFiles = null, // optional
} = {}) => {
  let schema = Yup.mixed().nullable();

  // ✅ required validation
  if (required) {
    schema = schema.test(
      "fileRequired",
      () => i18n.t("validations:file.required"),
      (value) => {
        if (!value?.length) return false; // no file
        const files = Array.isArray(value) ? value : [value];
        return files.length > 0;
      }
    );
  }

  // ✅ maxFiles
  if (maxFiles) {
    schema = schema.test(
      "maxFiles",
      () =>
        i18n.t("validations:file.max_files", {
          max: translateNumber(maxFiles),
        }),
      (value) => {
        if (!value?.length) return true; // skip if no file
        const files = Array.isArray(value) ? value : [value];
        return files.length <= maxFiles;
      }
    );
  }

  // ✅ allowedTypes
  if (allowedTypes.length > 0) {
    schema = schema.test(
      "fileType",
      () =>
        i18n.t("validations:file.invalid_type", {
          types: allowedTypes.join(", "),
        }),
      (value) => {
        if (!value?.length) return true; // skip if no file
        const files = Array.isArray(value) ? value : [value];
        return files.every((file) => allowedTypes.includes(file.type));
      }
    );
  }

  // ✅ maxSize
  if (maxSize) {
    schema = schema.test(
      "fileSize",
      () =>
        i18n.t("validations:file.max_size", {
          maxSize: translateNumber(maxSize, i18n.language, false),
        }),
      (value) => {
        if (!value?.length) return true; // skip if no file
        const files = Array.isArray(value) ? value : [value];
        return files.every((file) => file.size <= maxSize * 1024 * 1024);
      }
    );
  }

  return schema;
};
