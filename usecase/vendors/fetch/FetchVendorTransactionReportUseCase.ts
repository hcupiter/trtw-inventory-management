import {
  mapVendorTransactionReportToEntity,
  VendorTransactionReportDTO,
} from "@/models/dto/VendorTransactionReportDTO";
import { VendorTransactionReport } from "@/models/entity/VendorTransactionReport";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";

export const fetchVendorTransactionReportUseCase = async (
  vendorId: number,
  from: Date,
  to: Date
): Promise<VendorTransactionReport[]> => {
  try {
    const fromDate = formatDateToYYYYMMDD(from);
    const toDate = formatDateToYYYYMMDD(to);

    const response = await fetch(`/api/vendor/get/report?from=${fromDate}&to=${toDate}&vendorId=${vendorId}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Terjadi suatu kesalahan dalam mengambil laporan transaksi vendor");
    const mappedEntity: VendorTransactionReport[] = await Promise.all(
      data.results.map((element: VendorTransactionReportDTO) => mapVendorTransactionReportToEntity(element))
    );
    return Promise.resolve(mappedEntity);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
