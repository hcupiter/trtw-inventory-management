// utils/dateUtils.ts
export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split("T")[0]; // Extracts only YYYY-MM-DD
};
