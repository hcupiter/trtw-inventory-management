import { VendorDTO } from "@/models/dto/VendorDTO";
import { QuerySortOrder } from "../utils/QuerySortOrder";
import { VendorTransactionReportDTO } from "@/models/dto/VendorTransactionReportDTO";

export interface IVendorService {
	save(vendor: VendorDTO): Promise<boolean>;
	getById(id: number): Promise<VendorDTO | null>;
	getByVendorId(vendorId: string): Promise<VendorDTO | null>;
	getByNameOrId(
		query: string,
		limit?: number,
		offset?: number,
		sort?: QuerySortOrder
	): Promise<VendorDTO[]>;
	getAll(
		limit?: number,
		offset?: number,
		sort?: QuerySortOrder
	): Promise<VendorDTO[]>;
	getVendorTransactionReport(
		vendorId: number,
		from: string,
		to: string
	): Promise<VendorTransactionReportDTO[]>;
	update(vendor: VendorDTO): Promise<boolean>;
	delete(id: string): Promise<boolean>;
}
