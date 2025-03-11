"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWDatePicker from "@/components/ui/shared/datepicker/TRDWDatePicker";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { useState } from "react";
import { start } from "repl";

const TransactionsPage = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>();

  const handleSearch = () => {
    // Validate Date
    if (startDate > endDate) {
      setError("Error! Hari awal tidak boleh melebihi hari akhir!");
      return;
    }

    if (startDate > new Date()) {
      setError("Error! Hari awal tidak bisa melebihi hari ini!");
      return;
    }

    setError("");
  };

  return (
    <div className="flex flex-col justify-items-start w-full h-full">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-full">
        <h1 className="text-black text-2xl font-bold">Transaksi</h1>
        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          iconName="ic:baseline-plus"
        >
          Tambah transaksi
        </TRDWButton>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full h-full items-start justify-items-start">
        {/* Durasi Transaksi */}
        <div className="flex flex-col w-full gap-2">
          <p className="flex text-base font-bold">Durasi transaksi</p>
          {/* Button Container */}
          <div className="flex gap-4">
            <div className="flex gap-3 items-center">
              <TRDWDatePicker
                selected={startDate}
                onChange={(date: Date) => {
                  setStartDate(date);
                }}
              />
              <p>hingga</p>
              <TRDWDatePicker
                selected={endDate}
                onChange={(date: Date) => {
                  setEndDate(date);
                }}
              />
            </div>
            <TRDWButton
              iconName="material-symbols:search"
              onClick={handleSearch}
            >
              Cari
            </TRDWButton>
          </div>
          {error && <span className="text-red">{error}</span>}
        </div>

        {/* Data Transaksi */}
        <div className="w-full h-full">
          <TRDWEmptyView label={"Tidak ada transaksi..."} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
