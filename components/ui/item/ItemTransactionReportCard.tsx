import { ItemTransactionReport } from "@/models/entity/ItemTransactionReport";
import { CardBackground } from "../shared/cardBackground/CardBackground";
import { TRDWCardLabel } from "../shared/label/TRDWCardLabel";

export const ItemTransactionReportCard = ({
  report,
  onClick,
}: {
  report: ItemTransactionReport;
  onClick: (transactionId: number) => void;
}) => {
  return (
    <CardBackground>
      <TRDWCardLabel
        width={200}
        title={"Id transaksi"}
        description={String(report.transactionId)}
      />
    </CardBackground>
  );
};
