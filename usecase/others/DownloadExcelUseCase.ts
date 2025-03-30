import ExcelJS from "exceljs";

/**
 * Create and download the Excel file.
 */
export const downloadExcel = async (workbook: ExcelJS.Workbook, fileName: string): Promise<boolean> => {
  try {
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return Promise.resolve(true);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return Promise.reject(error);
  }
};
