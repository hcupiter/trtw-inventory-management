"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import { OverlayConfirmation } from "@/components/ui/shared/confirmation/OverlayConfirmation";
import TRDWDatePickerLabel from "@/components/ui/shared/datepicker/TRDWDatePickerLabel";
import TRDWDropdownLabel from "@/components/ui/shared/dropdown/TRDWDropdownLabel";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { TransactionItemCartCard } from "@/components/ui/transaction/item/TransactionItemCartCard";
import { TransactionItemSelectionView } from "@/components/ui/transaction/TransactionItemSelectionView";
import { useOverlay } from "@/context/OverlayContext";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { TransactionData } from "@/models/entity/TransactionData";
import {
  mapToTransactionItem,
  TransactionItemCardEntity,
} from "@/models/entity/TransactionItemCartEntity";
import { mapToTransactionType } from "@/models/entity/TransactionType";
import { calculateTotalCartPriceUseCase } from "@/usecase/transaction/CalculateTotalCartPriceUseCase";
import {
  addTransactionCartItemUseCase,
  removeTransactionCartItemUseCase,
} from "@/usecase/transaction/ModifyTransactionCartItemUseCase";
import { saveTransactionUseCase } from "@/usecase/transaction/SaveTransactionUseCase";
import { validateCartUseCase } from "@/usecase/transaction/ValidateCartUseCase";
import { errorWriter } from "@/utils/errorWriter";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddTransactionPage = () => {
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<string>("Tunai");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cart, setCart] = useState<TransactionItemCardEntity[]>([]);

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const { openOverlay, closeOverlay } = useOverlay();
  const handleAddItemToCartClickedEvent = () => {
    openOverlay({
      overlayContent: (
        <TransactionItemSelectionView
          carts={cart}
          onSelect={updateCart}
          onCancel={() => {
            closeOverlay();
          }}
        />
      ),
      isFullScreen: true,
    });
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

  useEffect(() => {
    const newPrice = calculateTotalCartPriceUseCase(cart);
    setTotalPrice(newPrice);
  }, [cart]);

  const handleAddCartItemEvent = (selectedItemId: number) => {
    const updatedCart = addTransactionCartItemUseCase(cart, selectedItemId);
    setCart(updatedCart);
  };

  const handleSubstractCartItemEvent = (selectedItemId: number) => {
    const updatedCart = removeTransactionCartItemUseCase(cart, selectedItemId);
    setCart(updatedCart);
  };

  const handleSaveTransactionButtonClick = () => {
    openOverlay({
      overlayContent: (
        <OverlayConfirmation
          title={"Konfirmasi Simpan Transaksi"}
          description={
            "Apakah data sudah benar? (Data transaksi tidak bisa diubah setelah dibuat)"
          }
          onConfirm={() => {
            closeOverlay();
            validateData();
          }}
          onCancel={() => {
            closeOverlay();
          }}
        />
      ),
    });
  };

  const validateData = () => {
    const newCartError = validateCartUseCase(cart);

    if (newCartError) {
      toast.error(newCartError);
    } else {
      saveTransaction();
    }
  };

  const saveTransaction = async () => {
    const mappedTransactionType = mapToTransactionType({
      text: transactionType,
    });

    try {
      if (!mappedTransactionType)
        throw new Error("Tipe transaksi tidak dikenal");

      const entity: TransactionData = {
        date: transactionDate,
        totalPrice: totalPrice,
        transactionItems: cart.map(mapToTransactionItem),
        transactionType: mappedTransactionType,
      };
      const result = await saveTransactionUseCase(entity);
      if (result) {
        toast.success(result);
        goBack();
      }
    } catch (error) {
      toast.error(errorWriter(error));
    }
  };

  return (
    <div className="flex flex-col justify-items-start w-full overflow-auto no-scrollbar gap-8">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-[80vw] fixed z-50 h-16 bg-white">
        <div className="flex gap-5 items-center">
          <Icon
            icon={"heroicons-outline:chevron-left"}
            className="w-7 h-7 hover:text-blue"
            onClick={goBack}
          />
          <h1 className="text-black text-2xl font-bold">Tambah transaksi</h1>
        </div>

        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          iconName="bx:edit"
          onClick={handleSaveTransactionButtonClick}
        >
          Simpan
        </TRDWButton>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 w-fit pt-16">
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

        <div className="flex flex-col w-fit">
          <TRDWButton
            iconName="ic:baseline-plus"
            onClick={handleAddItemToCartClickedEvent}
          >
            Tambah Barang
          </TRDWButton>
        </div>
      </div>

      <div className="flex flex-col gap-4 size-full">
        <h1 className="flex gap-2 text-lg font-bold">
          Daftar Barang Terjual <p className="text-red">*</p>
        </h1>
        <div className="flex w-full h-[45vh]">
          <ItemCartListView
            cart={cart}
            onAddClick={handleAddCartItemEvent}
            onSubstractClick={handleSubstractCartItemEvent}
          />
        </div>
      </div>
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
  if (cart.length <= 0)
    return <TRDWEmptyView label="Tidak ada daftar barang" />;

  return (
    <ListViewContainer scrollable={false}>
      {cart.map((item) => (
        <TransactionItemCartCard
          key={item.item.itemId}
          cartItem={item}
          onAddClick={onAddClick}
          onSubstractClick={onSubstractClick}
        />
      ))}
    </ListViewContainer>
  );
};

export default AddTransactionPage;
