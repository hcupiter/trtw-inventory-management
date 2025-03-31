import ExcelJS from "exceljs";
import { fetchVendorTransactionReportUseCase } from "../vendors/fetch/FetchVendorTransactionReportUseCase";
import { VendorTransactionReport } from "@/models/entity/VendorTransactionReport";
import { formatDateToIndonesian, formatDateToYYYYMMDD } from "@/utils/dateFormatter";
import { downloadExcel } from "./DownloadExcelUseCase";
import { formatNumber } from "@/utils/numberFormatter";
import { priceFormatter } from "@/utils/priceFormatter";

/**
 * Apply styles to the header row.
 */
const styleHeaderRow = (row: ExcelJS.Row) => {
  row.font = { bold: true };
  row.alignment = { horizontal: "center" };
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFCC00" }, // Yellow header background
    };
  });
};

export const exportVendorTransactionReportToExcel = async ({
  vendorId,
  startDate,
  endDate,
}: {
  vendorId: number;
  startDate: Date;
  endDate: Date;
}): Promise<boolean> => {
  try {
    const reports: VendorTransactionReport[] = await fetchVendorTransactionReportUseCase(
      vendorId,
      startDate,
      endDate
    );
    if (reports.length === 0) {
      throw new Error("Tidak ada transaksi pada range tanggal terpilih...");
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Vendor");

    sheet.columns = [
      { header: "Transaction ID", key: "transactionId" },
      { header: "Date", key: "date" },
      { header: "VendorId", key: "vendorId" },
      { header: "ItemId", key: "itemId" },
      { header: "Item name", key: "itemName" },
      { header: "Quantity", key: "quantity" },
      { header: "Sell Price", key: "sellPrice" },
      { header: "Total Price", key: "totalPrice" },
    ];

    // Apply header row styling
    styleHeaderRow(sheet.getRow(1));
    // Map reports to rows
    const transactionRows = reports.map((report) => ({
      transactionId: report.transactionId,
      date: formatDateToIndonesian(report.date),
      vendorId: report.transactionItem.vendor.vendorId,
      itemId: report.transactionItem.itemId,
      itemName: report.transactionItem.name,
      quantity: formatNumber(report.transactionItem.qty),
      sellPrice: priceFormatter(report.transactionItem.sellPrice),
      totalPrice: priceFormatter(report.transactionItem.totalPrice),
    }));

    // Reduce to calculate total amount
    const totalTransactionAmount = reports.reduce(
      (total, report) => total + report.transactionItem.totalPrice,
      0
    );

    // Add rows to the sheet
    transactionRows.forEach((row) => sheet.addRow(row));

    // Add an empty row for separation
    sheet.addRow({});

    // Add a summary row
    sheet.addRow({
      itemName: "Total Transaction Amount",
      totalPrice: priceFormatter(totalTransactionAmount),
    });

    // Auto-fit column widths
    sheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.((cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength + 2; // Add padding
    });

    return await downloadExcel(
      workbook,
      `vendor_transaction_report_${formatDateToYYYYMMDD(startDate)}_to_${formatDateToYYYYMMDD(
        endDate
      )}`
    );
  } catch (error) {
    return Promise.reject(error);
  }
};
