import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";
import { CardBackground } from "../../shared/cardBackground/CardBackground";
import { priceFormatter } from "@/utils/priceFormatter";
import TRDWButton, { ButtonVariant } from "../../shared/button/TRDWButton";
import { VendorTag } from "../../vendor/VendorTag";

export const TransactionItemCartCard = ({
  cartItem,
  onAddClick,
  onSubstractClick,
}: {
  cartItem: TransactionItemCardEntity;
  onAddClick: (selectedItemId: number) => void;
  onSubstractClick: (selectedItemId: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <CardBackground>
        <div className="flex flex-col w-full">
          <div className="flex gap-2 items-center border-b-1 mb-3 pb-3 border-gray-400/75">
            <VendorTag tag={cartItem.item.itemId} />
          </div>

          <div className="flex w-full justify-between">
            <ItemData cartItem={cartItem} />

            <div className="flex gap-3">
              <TRDWButton
                iconName="ic:baseline-plus"
                variant={ButtonVariant.SECONDARY}
                onClick={() => {
                  if (cartItem.item.id) onAddClick(cartItem.item.id);
                }}
              />
              <TRDWButton
                iconName="ic:baseline-minus"
                variant={ButtonVariant.DANGER}
                onClick={() => {
                  if (cartItem.item.id) onSubstractClick(cartItem.item.id);
                }}
              />
            </div>
          </div>
        </div>
      </CardBackground>
    </div>
  );
};

const ItemData = ({ cartItem }: { cartItem: TransactionItemCardEntity }) => {
  return (
    <div className="gap-4 flex">
      <div className="flex flex-col w-[16vw]">
        <p className="text-gray text-xs">{`Vendor (${cartItem.item.vendor.vendorId})`}</p>
        <p className="font-bold">{cartItem.item.name}</p>
      </div>
      <div className="flex flex-col w-24">
        <p className="text-gray text-xs">Jumlah</p>
        <p className="font-bold">{cartItem.qty}</p>
      </div>
      <div className="flex flex-col w-[10vw]">
        <p className="text-gray text-xs">Harga Jual</p>
        <p className="font-bold">{priceFormatter(cartItem.item.price)}</p>
      </div>
      <div className="flex flex-col w-[10vw]">
        <p className="text-gray text-xs">Total</p>
        <p className="font-bold">
          {priceFormatter(cartItem.item.price * cartItem.qty)}
        </p>
      </div>
    </div>
  );
};
