"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWDatePickerLabel from "@/components/ui/shared/datepicker/TRDWDatePickerLabel";
import TRDWDropdownLabel from "@/components/ui/shared/dropdown/TRDWDropdownLabel";
import { TransactionItemSelectionView } from "@/components/ui/transaction/TransactionItemSelectionView";
import { useOverlay } from "@/context/OverlayContext";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";
import {
  addTransactionCartItemUseCase,
  removeTransactionCartItemUseCase,
} from "@/usecase/transaction/ModifyTransactionCartItemUseCase";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddTransactionPage = () => {
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<string>("Transaksi");
  const [cart, setCart] = useState<TransactionItemCardEntity[]>([]);

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const { openOverlay, closeOverlay, makeFullScreen } = useOverlay();
  const handleAddItemToCartClickedEvent = () => {
    makeFullScreen(true);
    openOverlay(
      <TransactionItemSelectionView
        carts={cart}
        onSelect={updateCart}
        onCancel={() => {
          closeOverlay();
        }}
      />
    );
  };

  const updateCart = (item: ItemEntity) => {
    if (cart.some((element) => element.item.id == item.id)) return;
    const toSubmit: TransactionItemCardEntity = {
      item: item,
      qty: 1,
    };

    setCart((prevCart) => [...prevCart, toSubmit]);
    closeOverlay();
  };

  const handleAddCartItemEvent = (selectedItemId: number) => {
    const updatedCart = addTransactionCartItemUseCase(cart, selectedItemId);
    setCart(updatedCart);
  };

  const handleSubstractCartItemEvent = (selectedItemId: number) => {
    const updatedCart = removeTransactionCartItemUseCase(cart, selectedItemId);
    setCart(updatedCart);
  };

  return (
    <div className="flex flex-col justify-items-start w-full h-full gap-8">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex gap-5 items-center">
          <Icon
            icon={"heroicons-outline:chevron-left"}
            className="w-7 h-7 hover:text-blue"
            onClick={goBack}
          />
          <h1 className="text-black text-2xl font-bold">Tambah transaksi</h1>
        </div>

        <TRDWButton variant={ButtonVariant.SECONDARY} iconName="bx:edit">
          Simpan
        </TRDWButton>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 w-fit">
        <TRDWDatePickerLabel
          mandatory
          label={"Tanggal Transaksi"}
          selected={transactionDate}
          onChange={(date) => {
            if (date) {
              setTransactionDate(date);
            }
          }}
        />

        <TRDWDropdownLabel
          mandatory
          label={"Pembayaran"}
          contents={["Transfer", "Tunai"]}
          selected={transactionType}
          onChange={(selected) => {
            setTransactionType(selected);
          }}
        />

        <TRDWButton
          iconName="ic:baseline-plus"
          onClick={handleAddItemToCartClickedEvent}
        >
          Tambah Barang
        </TRDWButton>
      </div>

      <ItemCartListView
        cart={cart}
        onAddClick={handleAddCartItemEvent}
        onSubstractClick={handleSubstractCartItemEvent}
      />
    </div>
  );
};

const ItemCartListView = ({
  cart,
  onAddClick,
  onSubstractClick,
}: {
  cart: TransactionItemCardEntity[];
  onAddClick: (selectedItemId: number) => void;
  onSubstractClick: (selectedItemId: number) => void;
}) => {
  if (cart.length <= 0) return null;

  return (
    <div className="size-full">
      {cart.map((item) => (
        <div key={item.item.itemId} className="flex w-full justify-between">
          <div className="flex flex-col ">
            <p>{item.item.name} </p>
            <p>{item.qty}</p>
          </div>
          <div className="flex gap-3">
            <TRDWButton
              onClick={() => {
                if (item.item.id) onAddClick(item.item.id);
              }}
            >
              Tambah
            </TRDWButton>
            <TRDWButton
              onClick={() => {
                if (item.item.id) onSubstractClick(item.item.id);
              }}
            >
              Kurang
            </TRDWButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddTransactionPage;
