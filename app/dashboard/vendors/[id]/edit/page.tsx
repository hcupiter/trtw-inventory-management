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
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import {
  validateVendorId,
  validateVendorName,
} from "@/usecase/vendors/ValidateVendorDataUseCase";
import { updateVendorUseCase } from "@/usecase/vendors/UpdateVendorsUseCase";

const EditVendorPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const [vendorData, setVendorData] = useState<VendorEntity>();
  const [message, setMessage] = useState<string | null>();

  const [vendorId, setVendorId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [idError, setIdError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const validateData = async () => {
    if (!vendorData) return;
    cleanError();

    try {
      const newIdError = await validateVendorId(vendorId, vendorData.vendorId);
      const newNameError = await validateVendorName(name);

      setIdError(newIdError);
      setNameError(newNameError);

      if (!newIdError && !newNameError) {
        const success = await updateData();
        if (success) goBack();
      }
    } catch (error) {
      toast.error(errorWriter(error));
    }
  };

  const updateData = async () => {
    try {
      const toUpdateVendor: VendorEntity = {
        id: Number(params.id),
        vendorId: vendorId,
        name: name,
        address: address,
        phone: phone,
      };

      const success = await updateVendorUseCase(toUpdateVendor);
      toast.success(success);
      return true;
    } catch (error) {
      toast.error(errorWriter(error));
    }
  };

  const cleanError = () => {
    setIdError("");
    setNameError("");
  };

  const setData = (vendor?: VendorEntity) => {
    setVendorId(vendor?.vendorId || "");
    setName(vendor?.name || "");
    setAddress(vendor?.address || "");
    setPhone(vendor?.phone || "");
    setIdError("");
    setNameError("");
  };

  // Setup Data
  useEffect(() => {
    const setupData = async () => {
      setMessage("Mengambil data terbaru...");
      try {
        const fetched = await fetchVendorByIdUseCase(Number(params.id));
        setVendorData(fetched);
        setData(fetched);
      } catch (error) {
        setMessage(errorWriter(error));
      } finally {
        setMessage(null);
      }
    };

    setupData();
  }, [params.id]);

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
          <h1 className="text-black text-2xl font-bold">Edit vendor</h1>
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

export default EditVendorPage;
