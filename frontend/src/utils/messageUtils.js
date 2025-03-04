const MAX_LENGTH = 25;

export const trimMessage = (text, maxLength = MAX_LENGTH) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
