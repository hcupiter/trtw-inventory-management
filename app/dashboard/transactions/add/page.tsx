"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWDatePickerLabel from "@/components/ui/shared/datepicker/TRDWDatePickerLabel";
import TRDWDropdownLabel from "@/components/ui/shared/dropdown/TRDWDropdownLabel";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddTransactionPage = () => {
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<string>("Transaksi");

  const router = useRouter();
  const goBack = () => {
    router.back();
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

        <TRDWButton iconName="ic:baseline-plus">Tambah Barang</TRDWButton>
      </div>
    </div>
  );
};

export default AddTransactionPage;
