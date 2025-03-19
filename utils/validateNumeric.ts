export const isNumeric = (value: string) => {
  return /^\d*$/.test(value); // Allows only digits (0-9)
};
