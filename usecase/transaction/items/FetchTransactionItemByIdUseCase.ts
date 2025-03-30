import { mapTransactionItemToEntity } from "@/models/dto/TransactionItemDTO";
import { TransactionItem } from "@/models/entity/TransactionItem";

export const fetchTransactionItemByIdUseCase = async (
	id: number
): Promise<TransactionItem> => {
	try {
		const response = await fetch(`/api/transaction/item/get/id?id=${id}`);
		const data = await response.json();

		if (!response.ok)
			throw new Error(data.error || "Failed to fetch transaction items data");

		const mappedEntity: TransactionItem = await mapTransactionItemToEntity(
			data.result
		);

		return Promise.resolve(mappedEntity);
	} catch (error) {
		return Promise.reject(error);
	}
};
