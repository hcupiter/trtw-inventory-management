// utils/dateUtils.ts
export const formatDateToYYYYMMDD = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0]; // Extracts only YYYY-MM-DD
};

export const formatDateToYYYYMMDDHHMMSS = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export const formatDateToIndonesian = (date: Date): string => {
  return date.toLocaleDateString("id-ID", {
    weekday: "long", // Senin, Selasa, ...
    day: "numeric", // 24
    month: "long", // Maret, Januari, ...
    year: "numeric", // 2025
  });
};
