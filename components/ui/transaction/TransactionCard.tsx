import { CardBackground } from "../shared/cardBackground/CardBackground";
import { TRDWCardLabel } from "../shared/label/TRDWCardLabel";
import { formatDateToIndonesian } from "@/utils/dateFormatter";
import { priceFormatter } from "@/utils/priceFormatter";
import { Icon } from "@iconify/react";
import { TransactionSummary } from "@/models/entity/TransactionSummary";
import { TRDWCardTransactionTypeLabel } from "../shared/label/TRDWCardTransactionTypeLabel";

export const TransactionCard = ({
  transaction,
  onClick,
}: {
  transaction: TransactionSummary;
  onClick: (id: number) => void;
}) => {
  return (
    <CardBackground
      onClick={() => {
        onClick(transaction.id ?? -1);
      }}
    >
      <div className="flex items-center w-full justify-between">
        <div className="flex w-full gap-4">
          <TRDWCardLabel
            width={5}
            title="Id Transaksi"
            description={`${transaction.id}`}
          />
          <TRDWCardLabel
            width={15}
            title={"Tanggal Transaksi"}
            description={formatDateToIndonesian(transaction.date)}
          />
          <TRDWCardLabel
            width={10}
            title={"Total Transaksi"}
            description={`${priceFormatter(transaction.totalPrice)}`}
          />
          <TRDWCardTransactionTypeLabel
            label="Pembayaran"
            transactionType={transaction.transactionType.type}
          />
        </div>

        <Icon icon={"line-md:chevron-right"} />
      </div>
    </CardBackground>
  );
};
