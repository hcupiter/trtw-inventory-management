import { ItemEntity } from "@/models/entity/ItemEntity";
import { CardBackground } from "../shared/cardBackground/CardBackground";
import TRDWButton from "../shared/button/TRDWButton";
import { priceFormatter } from "@/utils/priceFormatter";
import { VendorTag } from "../vendor/VendorTag";

export const TransactionItemSelectionCard = ({
  itemEntity,
  onSelect,
}: {
  itemEntity: ItemEntity;
  onSelect: (item: ItemEntity) => void;
}) => {
  return (
    <CardBackground>
      <div className="w-full flex flex-col">
        <div className="flex gap-2 items-center border-b-1 mb-2 pb-2 border-gray-400/75">
          <VendorTag tag={itemEntity.itemId} />
        </div>
        <div className="w-full flex flex-row items-center justify-between">
          <ItemDescriptionSection itemEntity={itemEntity} />
          <ItemAction item={itemEntity} onSelect={onSelect} />
        </div>
      </div>
    </CardBackground>
  );
};

const ItemAction = ({
  item,
  onSelect,
}: {
  item: ItemEntity;
  onSelect: (item: ItemEntity) => void;
}) => {
  if (item.stockQty <= 0) return null;
  return (
    <TRDWButton
      onClick={() => {
        onSelect(item);
      }}
    >
      Tambah
    </TRDWButton>
  );
};

const ItemDescriptionSection = ({ itemEntity }: { itemEntity: ItemEntity }) => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col w-[5vw]">
        <p className="text-gray text-xs">{`Vendor`}</p>
        <p className="font-bold text-xs">{itemEntity.vendor.vendorId}</p>
      </div>

      <div className="flex flex-col w-[12vw]">
        <p className="text-gray text-xs">{`Nama Barang`}</p>
        <p className="font-bold text-xs">{itemEntity.name}</p>
      </div>

      <div className="flex flex-col w-[4vw]">
        <p className="text-gray text-xs">Stok</p>
        <p className="font-bold text-xs">{itemEntity.stockQty}</p>
      </div>

      <div className="flex flex-col w-[8vw]">
        <p className="text-gray text-xs">Harga</p>
        <p className="font-bold text-xs">{priceFormatter(itemEntity.price)}</p>
      </div>
    </div>
  );
};
