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
import { VendorDTO } from "@/models/dto/VendorDTO";
import { saveVendorUseCase } from "@/usecase/vendors/SaveVendorsUseCase";

const AddVendorsPage = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const [vendorId, setVendorId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [idError, setIdError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const validateData = async () => {
    setIdError("");
    setNameError("");
    try {
      var idFlag = true;
      var nameFlag = true;

      if (vendorId.length <= 0) {
        setIdError("Mohon mengisi id vendor!");
        idFlag = false;
      } else if (vendorId.length > 7) {
        setIdError("ID Vendor maksimal 7 huruf!");
        idFlag = false;
      } else {
        const response = await fetch(`/api/vendor/get/vendorId?id=${vendorId}`);
        if (response.ok) {
          setIdError("ID sudah terdaftar sebelumnya, mohon membuat id baru");
          idFlag = false;
        }
      }

      if (name.length <= 0) {
        setNameError("Mohon mengisi nama vendor!");
        nameFlag = false;
      }

      if (idFlag && nameFlag) {
        const success = await saveData();
        if (success) cleanData();
      }
    } catch (error) {
      toast.error(errorWriter(error));
    }
  };

  const saveData = async () => {
    try {
      const toSaveVendor: VendorDTO = {
        vendorId: vendorId,
        name: name,
        address: address,
        phone: phone,
      };

      const status = await saveVendorUseCase(toSaveVendor);
      toast.success(status);
      return true;
    } catch (error) {
      toast.error(errorWriter(error));
    }
  };

  const cleanData = () => {
    setVendorId("");
    setName("");
    setAddress("");
    setPhone("");
    setIdError("");
    setNameError("");
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
          <h1 className="text-black text-2xl font-bold">Tambah vendor</h1>
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
          label={"ID Vendor"}
          placeholder={"Masukkan id vendor disini..."}
          value={vendorId}
          onChange={(event) => {
            setVendorId(event.target.value);
          }}
          error={idError}
        />
        <TRDWTextField
          mandatory
          label={"Nama"}
          placeholder={"Masukkan nama vendor disini..."}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          error={nameError}
        />
        <TRDWTextField
          label={"Alamat"}
          placeholder={"Masukkan alamat vendor disini..."}
          value={address}
          onChange={(event) => {
            setAddress(event.target.value);
          }}
        />
        <TRDWTextField
          label={"No Telp."}
          placeholder={
            "Masukkan nomor telepon vendor yang bisa dihubungi disini..."
          }
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default AddVendorsPage;
