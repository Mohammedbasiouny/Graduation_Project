export const splitPhoneNumber = (phone) => {
  if (!phone) return { dialCode: "", phoneNumber: "" };

  const cleaned = phone.trim().replace(/\s+/g, " ");

  // match: +<digits> then space then the rest
  const match = cleaned.match(/^(\+\d{1,4})\s*(.*)$/);

  // If phone doesn't start with +, treat it as local number
  if (!match) {
    return {
      dialCode: "",
      phoneNumber: cleaned.replace(/\s+/g, ""),
    };
  }

  return {
    dialCode: match[1],
    phoneNumber: match[2].replace(/\s+/g, ""),
  };
};
