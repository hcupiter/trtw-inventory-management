"use client";

import { ItemSelectVendorField } from "@/components/ui/item/ItemSelectVendorField";
import { ItemSelectVendorView } from "@/components/ui/item/ItemSelectVendorView";
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import { TRTWCheckbox } from "@/components/ui/shared/checkbox/TRTWCheckbox";
import { OverlayConfirmation } from "@/components/ui/shared/confirmation/OverlayConfirmation";
import TRDWDatePicker from "@/components/ui/shared/datepicker/TRDWDatePicker";
import { TRTWFilePicker } from "@/components/ui/shared/filePicker/TRTWFilePicker";
import { OverlayContentContainer } from "@/components/ui/shared/overlay/OverlayContentContainer";
import { OverlayContentTitle } from "@/components/ui/shared/overlay/OverlayContentTitle";
import TRDWTextField from "@/components/ui/shared/textfield/TRDWTextField";
import { useOverlay } from "@/context/OverlayContext";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { BackupDatabaseUseCase } from "@/usecase/others/database/BackupDatabaseUseCase";
import { SetBackupDatabaseUseCase } from "@/usecase/others/database/SetBackupDatabaseUseCase";
import {
  ValidateFileDatabaseUseCase,
  ValidatePasswordDatabaseUseCase,
} from "@/usecase/others/database/ValidateDatabaseUseCase";
import { exportTransactionToExcelUseCase } from "@/usecase/others/ExportTransactionToExcelUseCase";
import { exportVendorTransactionReportToExcel } from "@/usecase/others/ExportVendorTransactionReportToExcelUseCase";
import { validateDateQueryUseCase } from "@/usecase/transaction/ValidateDateQueryUseCase";
import { formatDateToIndonesian } from "@/utils/dateFormatter";
import { errorWriter } from "@/utils/errorWriter";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  return (
    <div className="flex flex-col justify-items-start w-full gap-8 overflow-auto no-scrollbar">
      <TopTitle />
      <Content />
    </div>
  );
};

export default Page;

const Content = () => {
  return (
    <div className="flex flex-col gap-6 w-full h-full px-4 pt-16 *:border-b-1 *:border-gray-300 *:pb-3">
      <ExportTransactionToExcelContent />
      <ExportVendorTransactionReportToExcelContent />
      <BackupDatabaseView />
      <SetBackupDatabaseView />
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

const ExportTransactionToExcelContent = () => {
  const processExport = async (startDate: Date, endDate: Date) => {
    return await exportTransactionToExcelUseCase({
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Export ke excel</h1>
      <DateRangeSelector processExport={processExport} />
    </div>
  );
};

const ExportVendorTransactionReportToExcelContent = () => {
  const [vendor, setVendor] = useState<VendorEntity>();
  const processExport = async (
    startDate: Date,
    endDate: Date
  ): Promise<boolean> => {
    try {
      if (!vendor) throw new Error("Mohon pilih vendor untuk diekspor");
      return await exportVendorTransactionReportToExcel({
        vendorId: vendor.id,
        startDate: startDate,
        endDate: endDate,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const { openOverlay, closeOverlay } = useOverlay();

  const handleSelectVendor = () => {
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
      isFullScreen: true,
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-lg">Export Data Transaksi Vendor</h1>
      <div className="flex flex-col w-full gap-2">
        <ItemSelectVendorField
          mandatory
          label="Vendor"
          vendor={vendor || undefined}
          onVendorChangeTapped={() => handleSelectVendor()}
        />
        <DateRangeSelector processExport={processExport} />
      </div>
    </div>
  );
};

const DateRangeSelector = ({
  processExport,
}: {
  processExport: (startDate: Date, endDate: Date) => Promise<boolean>;
}) => {
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
            handleProcess={() => processExport(startDate, endDate)}
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
      <p className="flex text-base">Durasi</p>
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
  handleProcess,
  onCancel,
}: {
  from: Date;
  to: Date;
  handleProcess: () => Promise<boolean>;
  onCancel: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleExportData = async () => {
    try {
      setLoading(true);
      const result = await handleProcess();
      if (result) toast.success("Sukses mengekspor data...");
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

const BackupDatabaseView = () => {
  const { openOverlay, closeOverlay } = useOverlay();

  const handleBackupButtonPressed = async () => {
    try {
      openOverlay({
        overlayContent: (
          <StatusOverlay
            title="Sedang membackup database..."
            description="Mohon tunggu sebentar"
          />
        ),
      });
      const backupDatabaseResult = await BackupDatabaseUseCase();
      toast.success(backupDatabaseResult);
    } catch (error) {
      closeOverlay();
      toast.error(errorWriter(error));
    } finally {
      closeOverlay();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h1 className="font-bold text-lg w-fit">Backup Database</h1>
        <p className="w-fit">
          Harap backup database secara berkala agar mudah untuk dikembalikan
        </p>
      </div>
      <div className="flex w-fit">
        <TRDWButton onClick={handleBackupButtonPressed}>
          Dapatkan Backup database
        </TRDWButton>
      </div>
    </div>
  );
};

const SetBackupDatabaseView = () => {
  const { openOverlay, closeOverlay } = useOverlay();

  const handleSetBackupDatabaseView = () => {
    openOverlay({
      overlayContent: <PromptSetBackupDatabaseView onCancel={closeOverlay} />,
      isFullScreen: true,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h1 className="font-bold text-lg w-fit">Pasang Backup Database</h1>
        <p className="w-fit">
          Anda dapat memasang backup database apabila terjadi error atau
          kesalahan
        </p>
      </div>
      <div className="flex w-fit">
        <TRDWButton
          onClick={handleSetBackupDatabaseView}
          variant={ButtonVariant.SECONDARY}
        >
          Pasang Backup Database
        </TRDWButton>
      </div>
    </div>
  );
};

const PromptSetBackupDatabaseView = ({
  onCancel,
}: {
  onCancel: () => void;
}) => {
  const { openOverlay, closeOverlay } = useOverlay();
  const [file, setFile] = useState<File>();
  const [accessPass, setAccessPass] = useState<string>("");
  const [checkboxState, setCheckboxState] = useState({
    agreement: false,
  });

  const [accessPassError, setAccessPassError] = useState<string>();
  const [fileError, setFileError] = useState<string>();

  // Update state when a checkbox changes
  const handleCheckboxChange = (checkboxId: string, checked: boolean) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [checkboxId]: checked,
    }));
  };

  const validate = async (): Promise<boolean> => {
    const newAccessPassError = await ValidatePasswordDatabaseUseCase(
      accessPass
    );
    const newFileError = ValidateFileDatabaseUseCase(file);

    setAccessPassError(newAccessPassError);
    setFileError(newFileError);

    if (!newAccessPassError && !newFileError && checkboxState.agreement)
      return true;
    return false;
  };

  const handleSetDatabase = async () => {
    try {
      const isSuccess = await validate();
      if (!isSuccess) throw new Error("Mohon mengisi keseluruhan input");
      if (!file) throw new Error("Tidak ada file terdeteksi");
      const setBackupDatabase = await SetBackupDatabaseUseCase(file);
      if (!setBackupDatabase) throw new Error("Gagal memasang backup");
      toast.success("Sukses");

      closeOverlay();

      openOverlay({
        overlayContent: (
          <StatusOverlay
            title="Memperbaharui Data"
            description="Mohon tunggu sebentar..."
          />
        ),
      });
      window.location.reload();
      onCancel();
    } catch (error) {
      console.log(error);
      toast.error(errorWriter(error));
    }
  };

  useEffect(() => {
    setFileError(undefined);
  }, [file]);

  useEffect(() => {
    setAccessPassError(undefined);
  }, [accessPass]);

  return (
    <OverlayContentContainer>
      <div className="flex flex-col gap-6 items-start justify-center w-full h-full">
        <OverlayContentTitle
          title="Pasang Backup Database"
          onCancel={onCancel}
        />
        <div className="flex w-full h-full flex-col justify-between gap-6">
          <div className="w-full flex flex-col gap-2">
            <TRTWFilePicker
              mandatory
              label="File Database"
              error={fileError}
              file={file}
              onChange={(file) => {
                setFile(file);
              }}
            />
            <TRDWTextField
              mandatory
              label="Password"
              type="password"
              placeholder="Masukkan akses untuk memasang backup"
              value={accessPass}
              onChange={(event) => setAccessPass(event.target.value)}
              error={accessPassError}
            />
            <div className="mt-2 text-blue">
              <TRTWCheckbox
                checked={checkboxState.agreement}
                onChange={(checked) =>
                  handleCheckboxChange("agreement", checked)
                }
                label="Dengan ini saya menyadari kalau memasang backup database akan menggantikan database yang lama dan database sebelumnya tidak dapat dikembalikan lagi"
              />
            </div>
          </div>
          {checkboxState.agreement && (
            <TRDWButton onClick={handleSetDatabase}>
              Terapkan Backup Database
            </TRDWButton>
          )}
        </div>
      </div>
    </OverlayContentContainer>
  );
};

const StatusOverlay = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <OverlayContentContainer>
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="font-bold text-lg">{title}</div>
        <div className="text-base">{description}</div>
      </div>
    </OverlayContentContainer>
  );
};
