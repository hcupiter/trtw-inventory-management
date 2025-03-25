import { TransactionItem } from "@/models/entity/TransactionItem";
import { CardBackground } from "../../shared/cardBackground/CardBackground";
import { VendorTag } from "../../vendor/VendorTag";
import { TRDWCardLabel } from "../../shared/label/TRDWCardLabel";
import { priceFormatter } from "@/utils/priceFormatter";

export const TransactionItemCard = ({
  transactionItem,
}: {
  transactionItem: TransactionItem;
}) => {
  return (
    <CardBackground>
      <div className="flex flex-col w-full">
        <div className="flex gap-2 items-center border-b-1 mb-3 pb-3 border-gray-400/75">
          <VendorTag tag={transactionItem.itemId} />
        </div>

        <div className="flex w-full">
          <TRDWCardLabel
            width={6}
            title={"Vendor"}
            description={transactionItem.vendor.vendorId}
          />
          <TRDWCardLabel
            width={20}
            title="Nama"
            description={transactionItem.name}
          />
          <TRDWCardLabel
            width={10}
            title={"Harga Jual"}
            description={priceFormatter(transactionItem.sellPrice)}
          />
          <TRDWCardLabel
            width={10}
            title={"Jumlah beli"}
            description={String(transactionItem.qty)}
          />
          <TRDWCardLabel
            width={10}
            title={"Total"}
            description={priceFormatter(transactionItem.totalPrice)}
          />
        </div>
      </div>
    </CardBackground>
  );
};
