"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWTextField from "@/components/ui/shared/textfield/TRDWTextField";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState } from "react";
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
import { saveItemDataUseCase } from "@/usecase/items/SaveItemDataUseCase";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { ItemSelectVendorField } from "@/components/ui/item/ItemSelectVendorField";
import { useOverlay } from "@/context/OverlayContext";
import { ItemSelectVendorView } from "@/components/ui/item/ItemSelectVendorView";
import { isNumeric } from "@/utils/validateNumeric";

const AddItemsPage = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

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

  const { openOverlay, closeOverlay } = useOverlay();
  const handleChangeVendorTappedEvent = () => {
    setVendorError("");
    openOverlay({
      overlayContent: (
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
      ),
    });
  };

  const validateData = async () => {
    cleanError();

    const newIdError = await validateItemId(itemId);
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
      saveItem();
    }
  };

  const saveItem = async () => {
    try {
      if (itemId && name && price && stock && vendor) {
        const entity: ItemEntity = {
          itemId: itemId,
          name: name,
          price: Number(price),
          stockQty: Number(stock),
          vendor: vendor,
        };

        const result = await saveItemDataUseCase(entity);
        toast.success(result);
        cleanData();
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

  const cleanData = () => {
    setItemId("");
    setName("");
    setPrice("");
    setStock("");
    setVendor(null);
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
          <h1 className="text-black text-2xl font-bold">Tambah Barang</h1>
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

export default AddItemsPage;
