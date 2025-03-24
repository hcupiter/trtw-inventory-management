// utils/dateUtils.ts
export const formatDateToYYYYMMDD = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0]; // Extracts only YYYY-MM-DD
};

export const formatDateToIndonesian = (date: Date): string => {
  return date.toLocaleDateString("id-ID", {
    weekday: "long", // Senin, Selasa, ...
    day: "numeric", // 24
    month: "long", // Maret, Januari, ...
    year: "numeric", // 2025
  });
};
