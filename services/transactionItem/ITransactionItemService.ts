import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";

export interface ItransactionItemService {
	save(transactionItem: TransactionItemDTO): Promise<boolean>;
	getById(id: number): Promise<TransactionItemDTO | null>;
	getAll(
		limit?: number,
		offset?: number,
		sort?: QuerySortOrder
	): Promise<TransactionItemDTO[]>;
	getByItemID(id: number): Promise<TransactionItemDTO | null>;
	getByTransactionID(
		id: number,
		audit?: boolean,
		limit?: number,
		offset?: number,
		sort?: QuerySortOrder
	): Promise<TransactionItemDTO[]>;
	getByVendorID(
		id: number,
		limit?: number,
		offset?: number,
		sort?: QuerySortOrder
	): Promise<TransactionItemDTO[]>;
	getByTransactionIdAndItemId(
		transactionId: number,
		itemId: number
	): Promise<TransactionItemDTO | null>;
	updateByItemID(transactionItem: TransactionItemDTO): Promise<boolean>;
	deleteByItemID(id: number): Promise<boolean>;
	deleteByTransactionId(id: number): Promise<boolean>;
}
