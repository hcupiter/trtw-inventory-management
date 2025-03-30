import { TransactionItem } from "./TransactionItem";

export interface VendorTransactionReport {
	transactionId: number;
	date: Date;
	transactionItem: TransactionItem;
}
