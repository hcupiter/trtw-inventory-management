import { ItemEntity } from "@/models/entity/ItemEntity";
import { Icon } from "@iconify/react";
import { VendorTag } from "../vendor/VendorTag";
import { priceFormatter } from "@/utils/priceFormatter";
import { TRDWCardLabel } from "../shared/label/TRDWCardLabel";

export const ItemCard = ({
  item,
  onTap,
}: {
  item: ItemEntity;
  onTap: () => void;
}) => {
  return (
    <div
      className="flex px-4 py-3 w-full rounded-lg bg-white-smoke justify-between hover:bg-gray-200 items-center"
      onClick={onTap}
    >
      {/* Data */}
      <div className="flex gap-4 text-base">
        <VendorTag tag={item.vendorId} />
        {/* ID and Items name */}
        <div className="w-60 flex flex-col">
          <div className="font-bold text-base">{`ID: ${item.id}`}</div>
          <p className="text-base">{item.name}</p>
        </div>

        <TRDWCardLabel
          width={10}
          title={"Harga per biji"}
          description={priceFormatter(item.price)}
        />
        <TRDWCardLabel
          width={10}
          title={"Stok"}
          description={String(item.stockQty)}
        />
      </div>

      {/* Icon */}
      <Icon icon={"line-md:chevron-right"} />
    </div>
  );
};
