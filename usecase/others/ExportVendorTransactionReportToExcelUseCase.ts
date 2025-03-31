import ExcelJS from "exceljs";
import { fetchVendorTransactionReportUseCase } from "../vendors/fetch/FetchVendorTransactionReportUseCase";
import { VendorTransactionReport } from "@/models/entity/VendorTransactionReport";
import { formatDateToIndonesian, formatDateToYYYYMMDD } from "@/utils/dateFormatter";
import { downloadExcel } from "./DownloadExcelUseCase";
import { formatNumber } from "@/utils/numberFormatter";
import { priceFormatter } from "@/utils/priceFormatter";
import { autoFitColumns } from "./ExcelAutoFitColumn";

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
    const vendorIdString = reports.at(0)?.transactionItem.vendor.vendorId || vendorId;

    const workbook = new ExcelJS.Workbook();
    const vendorTransactionSheet = createVendorTransactionSheet(workbook, reports);
    const vendorItemSummarySheet = createVendorItemSummarySheet(workbook, reports);

    autoFitColumns([vendorTransactionSheet, vendorItemSummarySheet]);

    return await downloadExcel(
      workbook,
      `vendor_${vendorIdString}_transaction_report_${formatDateToYYYYMMDD(
        startDate
      )}_to_${formatDateToYYYYMMDD(endDate)}`
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

const createVendorItemSummarySheet = (
  workbook: ExcelJS.Workbook,
  reports: VendorTransactionReport[]
) => {
  const sheet = workbook.addWorksheet("Summary");

  // Group transactions by item name and price
  const groupedTransactions = new Map<string, { price: number; qty: number }>();

  reports.forEach((report) => {
    const key = `${report.transactionItem.name}-${report.transactionItem.sellPrice}`;
    const data = groupedTransactions.get(key);
    if (!data) {
      groupedTransactions.set(key, {
        price: report.transactionItem.sellPrice,
        qty: report.transactionItem.qty,
      });
    } else {
      groupedTransactions.set(key, {
        price: data.price,
        qty: data.qty + report.transactionItem.qty,
      });
    }
  });

  // Add headers
  const headerRow = sheet.addRow(["Item Name", "Sell Price", "Total Quantity Sold"]);
  styleHeaderRow(headerRow);

  // Apply header row styling
  styleHeaderRow(sheet.getRow(1));

  // Insert grouped data
  groupedTransactions.forEach(({ price, qty }, key) => {
    const [itemName] = key.split("-");
    sheet.addRow([itemName, priceFormatter(price), qty]);
  });

  // Add an empty row
  sheet.addRow([]);

  // Calculate total quantity per item
  const totalQuantityPerItem = new Map<string, number>();

  reports.forEach((report) => {
    const quantity = totalQuantityPerItem.get(report.transactionItem.name);
    if (!quantity) {
      totalQuantityPerItem.set(report.transactionItem.name, report.transactionItem.qty);
    } else {
      totalQuantityPerItem.set(report.transactionItem.name, quantity + report.transactionItem.qty);
    }
  });

  // Add summary header
  sheet.addRow(["Summary of Total Items Sold"]).font = { bold: true };
  const headerSummaryRow = sheet.addRow(["Item Name", "Total Quantity Sold"]);
  styleHeaderRow(headerSummaryRow);

  // Insert total quantity per item
  totalQuantityPerItem.forEach((qty, itemName) => {
    sheet.addRow([itemName, qty]);
  });

  return sheet;
};

const createVendorTransactionSheet = (
  workbook: ExcelJS.Workbook,
  reports: VendorTransactionReport[]
) => {
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

  return sheet;
};
