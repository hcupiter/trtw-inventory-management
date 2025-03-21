"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWTextField from "@/components/ui/shared/textfield/TRDWTextField";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { errorWriter } from "@/utils/errorWriter";
import { VendorEntity } from "@/models/entity/VendorEntity";
import {
  validateItemId,
  validateItemName,
  validateItemPrice,
  validateItemStock,
  validateItemVendor,
} from "@/usecase/items/ValidateItemDataUseCase";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { ItemSelectVendorField } from "@/components/ui/item/ItemSelectVendorField";
import { useOverlay } from "@/context/OverlayContext";
import { ItemSelectVendorView } from "@/components/ui/item/ItemSelectVendorView";
import { isNumeric } from "@/utils/validateNumeric";
import { updateItemUseCase } from "@/usecase/items/UpdateItemUseCase";
import { fetchItemByIdUseCase } from "@/usecase/items/fetch/FetchItemByIdUseCase";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";

const Page = () => {
  const params = useParams<{ id: string }>();
  const idNumber = Number(params.id);
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const [itemData, setItemData] = useState<ItemEntity>();

  const [itemId, setItemId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [vendor, setVendor] = useState<VendorEntity | null>(null);

  const [idError, setIdError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");
  const [stockError, setStockError] = useState<string>("");
  const [vendorError, setVendorError] = useState<string>("");

  const [message, setMessage] = useState<string | undefined>();

  const { openOverlay, closeOverlay } = useOverlay();
  const handleChangeVendorTappedEvent = () => {
    setVendorError("");
    openOverlay(
      <ItemSelectVendorView
        onSelect={(selectedVendor) => {
          setVendor(selectedVendor);
          if (vendor) {
            if (selectedVendor.id !== vendor.id)
              toast.success("Sukses memilih vendor");
          } else {
            toast.success("Sukses memilih vendor");
          }
        }}
        onCancel={closeOverlay}
      />
    );
  };

  const validateData = async () => {
    if (!itemData) return;
    cleanError();

    const newIdError = await validateItemId(itemId, itemData.itemId);
    const newNameError = validateItemName(name);
    const newPriceError = validateItemPrice(Number(price));
    const newStockError = validateItemStock(Number(stock));
    const newVendorError = await validateItemVendor(vendor || undefined);

    setIdError(newIdError);
    setNameError(newNameError);
    setPriceError(newPriceError);
    setStockError(newStockError);
    setVendorError(newVendorError);

    if (
      !newIdError &&
      !newNameError &&
      !newPriceError &&
      !newStockError &&
      !newVendorError
    ) {
      updateItem();
    }
  };

  const updateItem = async () => {
    try {
      if (itemId && name && price && stock && vendor) {
        const entity: ItemEntity = {
          id: idNumber,
          itemId: itemId,
          name: name,
          price: Number(price),
          stockQty: Number(stock),
          vendor: vendor,
        };

        const result = await updateItemUseCase(entity);
        toast.success(result);
        setData();
        goBack();
      } else {
        throw new Error("Mohon periksa kembali data...");
      }
    } catch (error) {
      toast.error(errorWriter(error));
    }
  };

  const cleanError = () => {
    setIdError("");
    setNameError("");
    setPriceError("");
    setStockError("");
    setVendorError("");
  };

  const setData = (entity?: ItemEntity) => {
    setItemId(entity?.itemId || "");
    setName(entity?.name || "");
    setPrice(String(entity?.price) || "");
    setStock(String(entity?.stockQty) || "");
    setVendor(entity?.vendor || null);
  };

  useEffect(() => {
    const fetchExistingData = async () => {
      setMessage("Sedang mengambil data...");
      try {
        const fetchedItemData = await fetchItemByIdUseCase(idNumber);
        setItemData(fetchedItemData);
        setData(fetchedItemData);
      } catch (error) {
        toast.error(errorWriter(error));
      } finally {
        setMessage(undefined);
      }
    };

    fetchExistingData();
  }, []);

  if (message) return <TRDWLoadingView label={message} />;

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
          <h1 className="text-black text-2xl font-bold">Edit Barang</h1>
        </div>

        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          iconName="bx:edit"
          onClick={validateData}
        >
          Simpan
        </TRDWButton>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <TRDWTextField
          mandatory
          type="text"
          label={"ID Barang"}
          placeholder={"Masukkan id barang disini..."}
          value={itemId}
          onChange={(event) => {
            setItemId(event.target.value);
            setIdError("");
          }}
          error={idError}
        />
        <TRDWTextField
          mandatory
          label={"Nama"}
          placeholder={"Masukkan nama barang disini..."}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setNameError("");
          }}
          error={nameError}
        />
        <TRDWTextField
          mandatory
          label={"Harga per biji (Rp)"}
          placeholder={"Masukkan harga barang per biji disini..."}
          value={price}
          onChange={(event) => {
            const val = event.target.value;
            if (isNumeric(val)) setPrice(val);
            setPriceError("");
          }}
          error={priceError}
        />
        <TRDWTextField
          mandatory
          label={"Stok Barang"}
          placeholder={"Masukkan stok barang disini..."}
          value={stock}
          onChange={(event) => {
            const val = event.target.value;
            if (isNumeric(val)) setStock(val);
            setStockError("");
          }}
          error={stockError}
        />
        <ItemSelectVendorField
          mandatory
          label="Vendor"
          vendor={vendor || undefined}
          onVendorChangeTapped={() => handleChangeVendorTappedEvent()}
          error={vendorError}
        />
      </div>
    </div>
  );
};

export default Page;
