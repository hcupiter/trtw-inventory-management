import { fetchTransactionByDateAuditUseCase } from "../transaction/fetch/FetchTransactionByDateAuditUseCase";
import ExcelJS from "exceljs";
import { TransactionAudit } from "@/models/entity/TransactionAudit";

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
    sheet.getRow(1).font = { bold: true };

    // Flatten transaction data (map each transaction item to a row)
    transactions.forEach((transaction) => {
      transaction.transactionItems.forEach((item) => {
        sheet.addRow({
          transactionId: transaction.id,
          date: transaction.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          transactionType: transaction.transactionType.type,
          itemName: item.name,
          quantity: item.qty,
          pricePerItem: item.sellPrice,
          totalItemPrice: item.qty * item.sellPrice,
          isDeleted: transaction.isDeleted,
        });
      });
    });

    // Apply auto-filter for better usability
    sheet.autoFilter = "A1:H1";

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
