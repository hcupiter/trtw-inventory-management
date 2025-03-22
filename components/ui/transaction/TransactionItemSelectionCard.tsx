import { ItemEntity } from "@/models/entity/ItemEntity";
import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";
import { CardBackground } from "../shared/cardBackground/CardBackground";
import { VendorTag } from "../vendor/VendorTag";
import TRDWButton from "../shared/button/TRDWButton";
import { priceFormatter } from "@/utils/priceFormatter";

export const TransactionItemSelectionCard = ({
  itemEntity,
  carts,
  onSelect,
}: {
  itemEntity: ItemEntity;
  carts: TransactionItemCardEntity[];
  onSelect: (item: ItemEntity) => void;
}) => {
  return (
    <CardBackground>
      <div className="w-full flex flex-col">
        <div className="flex gap-2 items-center border-b-1 mb-2 pb-2 border-gray-400/75">
          <p className="font-bold">{itemEntity.itemId}</p>
        </div>
        <div className="w-full flex flex-row items-center justify-between">
          <ItemDescriptionSection itemEntity={itemEntity} carts={carts} />
          <TRDWButton
            onClick={() => {
              onSelect(itemEntity);
            }}
          >
            Tambah
          </TRDWButton>
        </div>
      </div>
    </CardBackground>
  );
};

const ItemDescriptionSection = ({
  itemEntity,
  carts,
}: {
  itemEntity: ItemEntity;
  carts: TransactionItemCardEntity[];
}) => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col w-16">
        <p className="text-gray text-xs">{`Vendor`}</p>
        <p className="font-bold text-xs">{itemEntity.vendor.vendorId}</p>
      </div>

      <div className="flex flex-col w-56">
        <p className="text-gray text-xs">{`Nama Barang`}</p>
        <p className="font-bold text-xs">{itemEntity.name}</p>
      </div>

      <div className="flex flex-col w-24">
        <p className="text-gray text-xs">Stok</p>
        <p className="font-bold text-xs">{itemEntity.stockQty}</p>
      </div>

      <div className="flex flex-col w-32">
        <p className="text-gray text-xs">Harga</p>
        <p className="font-bold text-xs">{priceFormatter(itemEntity.price)}</p>
      </div>
    </div>
  );
};
