import { TransactionData } from "@/models/entity/TransactionData";
import { CardBackground } from "../shared/cardBackground/CardBackground";
import { TRDWCardLabel } from "../shared/label/TRDWCardLabel";
import { formatDateToIndonesian } from "@/utils/dateFormatter";
import { priceFormatter } from "@/utils/priceFormatter";
import { TransactionType } from "@/models/entity/TransactionType";
import { Icon } from "@iconify/react";

export const TransactionCard = ({
  transaction,
  onClick,
}: {
  transaction: TransactionData;
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
          <div className="flex flex-col">
            <p className="text-2xs text-gray">{"Pembayaran"}</p>
            <TransactionTypeDisplayer
              transactionType={transaction.transactionType}
            />
          </div>
        </div>

        <Icon icon={"line-md:chevron-right"} />
      </div>
    </CardBackground>
  );
};

const TransactionTypeDisplayer = ({
  transactionType,
}: {
  transactionType: TransactionType;
}) => {
  if (transactionType.id === 1)
    return (
      <div className="font-bold text-base text-blue">
        {transactionType.type}
      </div>
    );
  else
    return (
      <div className="font-bold text-base text-mint">
        {transactionType.type}
      </div>
    );
};
