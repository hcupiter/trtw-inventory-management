import ExcelJS from "exceljs";

export const autoFitColumns = (sheets: ExcelJS.Worksheet[]) => {
  sheets.forEach((sheet) => {
    sheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.((cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength + 2; // Add padding
    });
  });
};
