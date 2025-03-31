export const formatNumber = (num: string | number) => {
  if (!num) return "";
  return Number(num).toLocaleString("id-ID"); // Formats with dots as thousand separators
};

export const isNumeric = (value: string) => /^\d+$/.test(value); // Only allows numbers

export const getRawNumber = (val: string) => {
  return val.replace(/\D/g, "");
};
