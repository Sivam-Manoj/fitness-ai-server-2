// Function to fix spacing issues
export const fixSpacing = (text: string): string => {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Fix camelCase words
    .replace(/([a-zA-Z])([,.!?])/g, "$1 $2") // Ensure space before punctuation
    .replace(/(?<=\w)(?=[A-Z])/g, " ") // Ensure space before capital letters
    .replace(/(?<=\w)(?=[.,!?])/g, " ") // Ensure space before punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
};
