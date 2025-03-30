import { fetchTransactionItemByIdUseCase } from "@/usecase/transaction/items/FetchTransactionItemByIdUseCase";
import { VendorTransactionReport } from "../entity/VendorTransactionReport";

export interface VendorTransactionReportDTO {
	transactionId: number;
	date: string;
	transactionItemId: number;
}

export const mapTransactionReportToEntity = async (
	dto: VendorTransactionReportDTO
): Promise<VendorTransactionReport> => {
	try {
		const transactionItem = await fetchTransactionItemByIdUseCase(
			dto.transactionItemId
		);

		return Promise.resolve({
			transactionId: dto.transactionId,
			date: new Date(dto.date),
			transactionItem: transactionItem,
		});
	} catch (error) {
		throw error;
	}
};
