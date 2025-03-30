import { fetchTransactionByDateAuditUseCase } from "../transaction/fetch/FetchTransactionByDateAuditUseCase";
import ExcelJS from "exceljs";
import { TransactionAudit } from "@/models/entity/TransactionAudit";
import { formatNumber } from "@/utils/numberFormatter";
import { priceFormatter } from "@/utils/priceFormatter";
import { downloadExcel } from "./DownloadExcelUseCase";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";

/**
 * Fetch transactions within a given date range.
 */
const fetchTransactions = async (startDate: Date, endDate: Date): Promise<TransactionAudit[]> => {
  return fetchTransactionByDateAuditUseCase({ from: startDate, to: endDate });
};

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

const summaryStyles: Record<string, string> = {
  Tunai: "FFA4FFA4", // Light green
  Transfer: "FF91D2FF", // Light blue
};

/**
 * Apply styles to deleted transaction rows.
 */
const styleDeletedRow = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF9999" }, // Light red background
    };
  });
};

/**
 * Apply styles to transfer transaction rows.
 */
const styleTransferRow = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF91D2FF" }, // Light blue background
    };
  });
};

const styleTunaiRow = (row: ExcelJS.Row) => {
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFA4FFA4" }, // Light blue background
    };
  });
};

/**
 * Generate and download an Excel file with transaction data.
 */
export const exportTransactionToExcelUseCase = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Promise<boolean> => {
  try {
    const transactions = await fetchTransactions(startDate, endDate);
    if (transactions.length === 0) {
      throw new Error("Tidak ada transaksi pada range tanggal terpilih...");
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Transaksi");

    sheet.columns = [
      { header: "Transaction ID", key: "transactionId", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Transaction Type", key: "transactionType", width: 20 },
      { header: "Item Name", key: "itemName", width: 25 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price Per Item", key: "pricePerItem", width: 15 },
      { header: "Total Price", key: "totalItemPrice", width: 15 },
      { header: "Deleted", key: "isDeleted", width: 15 },
    ];

    // Apply header row styling
    styleHeaderRow(sheet.getRow(1));

    // Store total amount per transaction type (excluding deleted)
    const transactionSummary: Record<string, number> = {};

    // Add transaction rows
    transactions.forEach((transaction) => {
      transaction.transactionItems.forEach((item) => {
        const row = sheet.addRow({
          transactionId: transaction.id,
          date: transaction.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          transactionType: transaction.transactionType.type,
          itemName: item.name,
          quantity: formatNumber(item.qty),
          pricePerItem: priceFormatter(item.sellPrice),
          totalItemPrice: priceFormatter(item.qty * item.sellPrice),
          isDeleted: transaction.isDeleted ? "Yes" : "No",
        });

        // Apply styling for deleted transactions
        if (transaction.isDeleted) {
          styleDeletedRow(row);
        } else {
          // Apply Styling for transfer transaction type
          if (transaction.transactionType.type.toLowerCase() === "transfer") {
            styleTransferRow(row);
          } else if (transaction.transactionType.type.toLowerCase() === "tunai") {
            styleTunaiRow(row);
          }
        }

        // Calculate total price per transaction type (excluding deleted)
        if (!transaction.isDeleted) {
          transactionSummary[transaction.transactionType.type] =
            (transactionSummary[transaction.transactionType.type] || 0) + item.qty * item.sellPrice;
        }
      });
    });

    // Apply auto-filter
    sheet.autoFilter = "A1:H1";

    // Add an empty row for separation
    sheet.addRow({});

    // Add summary rows
    Object.entries(transactionSummary).forEach(([type, total]) => {
      const summaryRow = sheet.addRow({
        transactionType: type,
        totalItemPrice: priceFormatter(total),
      });

      summaryRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: summaryStyles[type] || "FFD3D3D3" }, // Default: Light Gray if not specified
        };
      });
    });

    // Generate and download the Excel file
    return await downloadExcel(
      workbook,
      `transaction_${formatDateToYYYYMMDD(startDate)}_to_${formatDateToYYYYMMDD(endDate)}`
    );
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return Promise.reject(error);
  }
};
