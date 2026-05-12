import { showToast } from "./toast.util";

export const applyFormServerErrors = (
  serverErrors,
  setError,
  options = { joinMessages: false }
) => {
  if (!serverErrors) return;

  Object.entries(serverErrors).forEach(([field, messages]) => {
    const message = Array.isArray(messages)
      ? options.joinMessages
        ? messages.join(", ")
        : messages[0]
      : messages;

    // 🔥 Case 1: dot notation (meals.0.meal_id)
    if (field.includes(".")) {
      const path = field.split(".");
      const [root, index, key] = path;

      if (root === "meals" && index && key) {
        setError(`meals.${index}.${key}`, {
          type: "server",
          message,
        });
        return;
      }
    }

    // 🔥 Case 2: normal flat field
    setError(field, {
      type: "server",
      message,
    });
  });
};

export const showServerMessages = (
  messages,
  toastOptions = { type: "error", time: 5000 },
  joinMessages = false
) => {
  const messageArray = Array.isArray(messages) ? messages : [messages];

  if (joinMessages) {
    const combinedMessage = messageArray.join(", ");
    showToast(toastOptions.type, combinedMessage, toastOptions.time);
  } else {
    messageArray.forEach((msg) => {
      showToast(toastOptions.type, msg, toastOptions.time);
    });
  }
};

export function objectToFormData(data, formData = new FormData()) {
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // ✅ Single File
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    // ✅ FileList (KEEP SAME NAME)
    if (value instanceof FileList) {
      Array.from(value).forEach(file => {
        formData.append(key, file); // 👈 no [0]
      });
      return;
    }

    // ✅ Array (non-files)
    if (Array.isArray(value)) {
      value.forEach(item => {
        formData.append(key, item);
      });
      return;
    }

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    // ✅ Object (simple stringify)
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // ✅ Primitive
    formData.append(key, value);
  });

  return formData;
}