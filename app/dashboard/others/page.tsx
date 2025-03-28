"use client";

import TRDWButton from "@/components/ui/shared/button/TRDWButton";
import TRDWDatePicker from "@/components/ui/shared/datepicker/TRDWDatePicker";
import { validateDateQueryUseCase } from "@/usecase/transaction/ValidateDateQueryUseCase";
import { useCallback, useState } from "react";

export const Page = () => {
  return (
    <div className="flex flex-col justify-items-start w-full h-screen gap-8 overflow-auto no-scrollbar">
      <TopTitle />
      <Content />
    </div>
  );
};

const Content = () => {
  return (
    <div className="flex flex-col gap-6 w-full h-full px-4 pt-16 *:border-b-1 *:border-gray-300 *:pb-3">
      <div className="flex flex-col">
        <h1 className="font-bold text-lg">Export ke excel</h1>
        <TransactionDuration />
      </div>
    </div>
  );
};

const TopTitle = () => {
  return (
    <div className="flex flex-row items-start justify-between w-[80vw] bg-white fixed z-50 h-16">
      <h1 className="text-black text-2xl font-bold">Fitur lain</h1>
    </div>
  );
};

const TransactionDuration = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dateError, setDateError] = useState<string>();

  const handleExport = () => {
    const isDateValid = validateDate();
  };

  const validateDate = useCallback(() => {
    const newDateError = validateDateQueryUseCase({
      from: startDate,
      to: endDate,
    });

    setDateError(newDateError);
    return !newDateError;
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col w-full gap-2">
      <p className="flex text-base">Durasi transaksi</p>
      {/* Date Selection Container */}
      <div className="flex gap-4">
        <div className="flex gap-3 items-center">
          <TRDWDatePicker
            selected={startDate}
            onChange={(date) => {
              if (date) {
                setStartDate(date);
              }
            }}
          />
          <p>hingga</p>
          <TRDWDatePicker
            selected={endDate}
            onChange={(date) => {
              if (date) {
                setEndDate(date);
              }
            }}
          />
        </div>
        <TRDWButton onClick={handleExport}>Export</TRDWButton>
      </div>
      {dateError && <span className="text-red">{dateError}</span>}
    </div>
  );
};

export default Page;
