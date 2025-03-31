import { ItemTransactionReport } from "@/models/entity/ItemTransactionReport";
import { CardBackground } from "../shared/cardBackground/CardBackground";
import { TRDWCardLabel } from "../shared/label/TRDWCardLabel";
import { formatDateToIndonesian } from "@/utils/dateFormatter";
import { priceFormatter } from "@/utils/priceFormatter";
import { TRDWCardTransactionTypeLabel } from "../shared/label/TRDWCardTransactionTypeLabel";
import { Icon } from "@iconify/react";

export const ItemTransactionReportCard = ({
  report,
  onClick,
}: {
  report: ItemTransactionReport;
  onClick: (transactionId: number) => void;
}) => {
  return (
    <CardBackground
      onClick={() => {
        onClick(report.transactionId);
      }}
    >
      <div className="flex flex-row gap-2">
        <TRDWCardLabel width={4} title={"Id"} description={String(report.transactionId)} />
        <TRDWCardLabel
          width={12}
          title={"Tanggal transaksi"}
          description={formatDateToIndonesian(report.date)}
        />

        <TRDWCardLabel
          width={8}
          title={"Harga per barang"}
          description={priceFormatter(report.price)}
        />
        <TRDWCardLabel width={8} title={"Jumlah dijual"} description={String(report.qty)} />
        <TRDWCardLabel width={10} title={"Total"} description={priceFormatter(report.totalPrice)} />
        <TRDWCardTransactionTypeLabel label="Pembayaran" transactionType={report.transactionType} />
      </div>

      <Icon icon={"line-md:chevron-right"} />
    </CardBackground>
  );
};
