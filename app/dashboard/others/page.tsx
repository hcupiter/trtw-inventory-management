"use client";

import TRDWButton from "@/components/ui/shared/button/TRDWButton";
import { OverlayConfirmation } from "@/components/ui/shared/confirmation/OverlayConfirmation";
import TRDWDatePicker from "@/components/ui/shared/datepicker/TRDWDatePicker";
import { OverlayContentContainer } from "@/components/ui/shared/overlay/OverlayContentContainer";
import { OverlayContentTitle } from "@/components/ui/shared/overlay/OverlayContentTitle";
import { useOverlay } from "@/context/OverlayContext";
import { exportToExcelUseCase } from "@/usecase/others/ExportToExcelUseCase";
import { validateDateQueryUseCase } from "@/usecase/transaction/ValidateDateQueryUseCase";
import { formatDateToIndonesian } from "@/utils/dateFormatter";
import { errorWriter } from "@/utils/errorWriter";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

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

  const { openOverlay, closeOverlay } = useOverlay();

  const handleExport = () => {
    const isDateValid = validateDate();
    if (isDateValid)
      openOverlay({
        overlayContent: (
          <ExportExcelView
            onCancel={closeOverlay}
            from={startDate}
            to={endDate}
          />
        ),
      });
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

const ExportExcelView = ({
  from,
  to,
  onCancel,
}: {
  from: Date;
  to: Date;
  onCancel: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleExportData = async () => {
    setLoading(true);

    try {
      const result = await exportToExcelUseCase({
        startDate: from,
        endDate: to,
      });

      if (result) toast.success("Sukses mengekspor data!");
    } catch (error) {
      toast.error(errorWriter(error));
      onCancel();
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  if (loading)
    return (
      <OverlayContentContainer>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="font-bold text-lg">Sedang mengekspor data...</div>
          <div className="text-base">Mohon tunggu sebentar...</div>
        </div>
      </OverlayContentContainer>
    );

  return (
    <OverlayConfirmation
      title="Konfirmasi export data ke excel"
      description={`Apakah anda yakin untuk mengekspor data transaksi dari tanggal ${formatDateToIndonesian(
        from
      )} hingga tanggal ${formatDateToIndonesian(to)}`}
      onConfirm={handleExportData}
      onCancel={onCancel}
    />
  );
};

export default Page;
