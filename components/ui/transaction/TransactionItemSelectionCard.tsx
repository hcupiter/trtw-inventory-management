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
  const itemInCart = carts.find(
    (element) => element.itemId === itemEntity.itemId
  );

  const stockToDisplay = (itemInCart?: TransactionItemCardEntity) => {
    if (itemInCart) {
      return itemEntity.stockQty - itemInCart.qty;
    } else {
      return itemEntity.stockQty;
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col w-16">
        <p className="text-gray text-xs">{`Vendor`}</p>
        <p className="font-bold text-xs">{itemEntity.vendor.vendorId}</p>
      </div>

      <div className="flex flex-col w-56">
        <p className="text-gray text-xs">{`(${itemEntity.itemId})`}</p>
        <p className="font-bold text-xs">{itemEntity.name}</p>
      </div>

      <div className="flex flex-col w-24">
        <p className="text-gray text-xs">Stok</p>
        <p className="font-bold text-xs">{stockToDisplay(itemInCart)}</p>
      </div>

      <div className="flex flex-col w-32">
        <p className="text-gray text-xs">Harga</p>
        <p className="font-bold text-xs">{priceFormatter(itemEntity.price)}</p>
      </div>
    </div>
  );
};
