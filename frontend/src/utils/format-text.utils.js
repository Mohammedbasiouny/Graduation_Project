export const truncateText = (text, maxLength = 20, withEllipsis = true) => {
  if (!text) return "N/A";
  return text.length > maxLength
    ? text.slice(0, maxLength) + (withEllipsis ? "..." : "")
    : text;
};

export const limitWords = (text, wordsPerLine = 3) => {
  if (!text) return "N/A";

  const words = text.trim().split(/\s+/);
  const lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  return lines.join("\n");
};
