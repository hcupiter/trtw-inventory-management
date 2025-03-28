import {
  mapTransactionDataToAuditEntity,
  mapTransactionDataToEntity,
  TransactionDTO,
} from "@/models/dto/TransactionDTO";
import { TransactionAudit } from "@/models/entity/TransactionAudit";
import { TransactionData } from "@/models/entity/TransactionData";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";

export const fetchTransactionByDateAuditUseCase = async ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): Promise<TransactionAudit[]> => {
  try {
    const fromDate = formatDateToYYYYMMDD(from);
    const toDate = formatDateToYYYYMMDD(to);

    const response = await fetch(
      `/api/transaction/get/range?from=${fromDate}&to=${toDate}&audit=true`
    );

    const data = await response.json();

    if (!response.ok)
      throw new Error(
        data.error ||
          `Gagal mengambil data transaksi dari ${from.toDateString()} hingga ${to.toDateString()}`
      );

    const mappedEntity: TransactionAudit[] = await Promise.all(
      data.transactions.map((element: TransactionDTO) =>
        mapTransactionDataToAuditEntity(element, true)
      )
    );

    return Promise.resolve(mappedEntity);
  } catch (error) {
    return Promise.reject(error);
  }
};
