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
import { mapVendorToEntity, VendorDTO } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";

const EditVendorPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const [message, setMessage] = useState<string | null>();

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
        const response = await fetch(`/api/vendor/get/id?id=${vendorId}`);
        const checkVendor = await response.json();
        if (checkVendor.ok) {
          setIdError("ID sudah terdaftar sebelumnya, mohon membuat id baru");
          idFlag = false;
        }
      }

      if (name.length <= 0) {
        setNameError("Mohon mengisi nama vendor!");
        nameFlag = false;
      }

      if (idFlag && nameFlag) {
        const success = await updateData();
        if (success) setData();
      }
    } catch (error) {
      toast.error(errorWriter(error));
    }
  };

  const updateData = async () => {
    try {
      const toUpdateVendor: VendorDTO = {
        id: Number(params.id),
        vendorId: vendorId,
        name: name,
        address: address,
        phone: phone,
      };

      const response = await fetch("/api/vendor", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toUpdateVendor),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update vendor");
      }

      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(errorWriter(error));
    }
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
        setData(fetched);
      } catch (error) {
        setMessage(errorWriter(error));
      } finally {
        setMessage(null);
      }
    };

    setupData();
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
