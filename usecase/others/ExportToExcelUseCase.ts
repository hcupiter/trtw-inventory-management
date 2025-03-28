import { fetchTransactionByDateAuditUseCase } from "../transaction/fetch/FetchTransactionByDateAuditUseCase";
import ExcelJS from "exceljs";
import { TransactionAudit } from "@/models/entity/TransactionAudit";
import { formatNumber } from "@/utils/numberFormatter";
import { priceFormatter } from "@/utils/priceFormatter";

export const exportToExcelUseCase = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Promise<boolean> => {
  try {
    const transactions: TransactionAudit[] =
      await fetchTransactionByDateAuditUseCase({
        from: startDate,
        to: endDate,
      });

    if (transactions.length === 0) {
      throw new Error("No transactions found for the selected date range.");
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

    // Apply bold formatting to headers
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFCC00" }, // Yellow header background
      };
    });

    // Store total amount per transaction type
    const transactionSummary: Record<string, number> = {};

    // Flatten transaction data (map each transaction item to a row)
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

        // Apply red background if isDeleted is true
        if (transaction.isDeleted) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF9999" }, // Light red background
            };
          });
        }

        // Only calculate the non deleted transaction
        if (!transaction.isDeleted) {
          // Calculate total price per transaction type
          if (!transactionSummary[transaction.transactionType.type]) {
            transactionSummary[transaction.transactionType.type] = 0;
          }
          transactionSummary[transaction.transactionType.type] +=
            item.qty * item.sellPrice;
        }
      });
    });

    // Apply auto-filter for better usability
    sheet.autoFilter = "A1:H1";

    // Add empty row for separation
    sheet.addRow({});

    // Add summary rows
    Object.entries(transactionSummary).forEach(([type, total]) => {
      const summaryRow = sheet.addRow({
        transactionType: type,
        totalItemPrice: priceFormatter(total),
      });

      summaryRow.eachCell((cell) => {
        cell.font = { bold: true };
      });
    });

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob and trigger download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element and click it
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${startDate.toISOString().split("T")[0]}_to_${
      endDate.toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(a); // Append to DOM to be safe
    a.click();
    document.body.removeChild(a); // Clean up

    // Cleanup
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};
