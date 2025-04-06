"use client";
import { OverlayConfirmation } from "@/components/ui/shared/confirmation/OverlayConfirmation";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import { useOverlay } from "@/context/OverlayContext";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { ItemTransactionReport } from "@/models/entity/ItemTransactionReport";
import { deleteItemUseCase } from "@/usecase/items/DeleteItemUseCase";
import { fetchItemByIdUseCase } from "@/usecase/items/fetch/FetchItemByIdUseCase";
import { fetchItemTransactionReportUseCase } from "@/usecase/items/fetch/FetchItemTransactionReportUseCase";
import { errorWriter } from "@/utils/errorWriter";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import TRDWButton, { ButtonVariant } from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { TRDWLabel } from "@/components/ui/shared/label/TRDWLabel";
import { priceFormatter } from "@/utils/priceFormatter";
import { DateRangeSelector } from "@/components/ui/shared/dateRangeSelector/DateRangeSelector";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { ItemTransactionReportCard } from "@/components/ui/item/ItemTransactionReportCard";
import { CardBackground } from "@/components/ui/shared/cardBackground/CardBackground";
import { GetItemTransactionSummary } from "@/usecase/items/GetItemTransactionSummaryUseCase";
import { TRDWCardLabel } from "@/components/ui/shared/label/TRDWCardLabel";
import { formatNumber } from "@/utils/numberFormatter";
import { TRTWSelectionTag } from "@/components/ui/shared/selectionTag/TRTWSelectionTag";
import { validateDateQueryUseCase } from "@/usecase/transaction/ValidateDateQueryUseCase";

export default function Page() {
  const params = useParams<{ id: string }>();
  const idNumber = Number(params.id);

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const handleEditItemDataClicked = () => {
    router.push(`/dashboard/items/${params.id}/edit`);
  };

  const { openOverlay, closeOverlay } = useOverlay();
  const handleDeleteItemDataClicked = () => {
    openOverlay({
      overlayContent: (
        <OverlayConfirmation
          title={"Konfirmasi Hapus"}
          description={"Apakah anda yakin untuk menghapus barang ini?"}
          onConfirm={deleteItem}
          onCancel={closeOverlay}
        />
      ),
      isFullScreen: false,
    });
  };

  const deleteItem = async () => {
    try {
      const idToDelete = Number(params.id);

      if (!idToDelete) throw new Error("Id barang yang akan dihapus tidak valid");

      const result = await deleteItemUseCase(idToDelete);
      toast.success(result);
      closeOverlay();
      router.push(`/dashboard/items`);
    } catch (error) {
      toast.error(errorWriter(error));
      closeOverlay();
    }
  };

  const [itemData, setItemData] = useState<ItemEntity | undefined>();
  const [message, setMessage] = useState<string | undefined>();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [shouldFetch, setShouldFetch] = useState<boolean>(true); // Flag for initial fetch
  const [dateError, setDateError] = useState<string>();
  const [transactionReports, setTransactionReports] = useState<ItemTransactionReport[]>([]);

  const [reportMessage, setReportMessage] = useState<string | undefined>();

  const fetchTransactionReportData = useCallback(
    async (itemData: ItemEntity, idNumber: number, startDate: Date, endDate: Date) => {
      if (!shouldFetch) return; // Prevent unnecessary fetching
      setReportMessage("Mengambil data...");

      try {
        if (!itemData) return;
        const fetchedTransactionReports = await fetchItemTransactionReportUseCase(
          idNumber,
          itemData.itemId,
          startDate,
          endDate
        );
        setTransactionReports(fetchedTransactionReports);
      } catch (error) {
        toast.error(errorWriter(error));
      } finally {
        setReportMessage(undefined);
        setShouldFetch(false); // Reset fetch flag after completion
      }
    },
    [shouldFetch]
  );

  const fetchItemData = useCallback(async () => {
    setMessage("Menampilkan data...");

    try {
      const fetchedItemData = await fetchItemByIdUseCase(idNumber);
      setItemData(fetchedItemData);
    } catch (error) {
      setMessage(errorWriter(error));
    } finally {
      setMessage(undefined);
    }
  }, [idNumber]);

  // Fetch Vendor Details on mount
  useEffect(() => {
    fetchItemData();
    // Only `idNumber` and `fetchTransactionReportData` affect `fetchItemData`
  }, [fetchItemData]);

  useEffect(() => {
    if (!itemData) return;
    fetchTransactionReportData(itemData, idNumber, startDate, endDate);
  }, [fetchTransactionReportData, itemData, idNumber, startDate, endDate]);

  const handleSearchClicked = () => {
    const isDateValid = validateDate();
    if (!isDateValid) setShouldFetch(false);
    else {
      setShouldFetch(true); // Allow fetching on user action
      if (itemData) fetchTransactionReportData(itemData, idNumber, startDate, endDate);
      return;
    }
  };

  const validateDate = (): boolean => {
    const newDateError = validateDateQueryUseCase({
      from: startDate,
      to: endDate,
    });

    setDateError(newDateError);
    return !newDateError;
  };

  const handleItemReportClicked = (transactionId: number) => {
    router.push(`/dashboard/transactions/${transactionId}`);
  };

  if (message) return <TRDWLoadingView label={message} />;
  if (!itemData) return <TRDWEmptyView label="Tidak ada data barang" />;

  return (
    <div className="flex flex-col justify-items-start w-full gap-8 overflow-auto no-scrollbar">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-[80vw] fixed z-50 h-16 bg-white">
        <div className="flex gap-5 items-center">
          <Icon
            icon={"heroicons-outline:chevron-left"}
            className="w-7 h-7 hover:text-blue"
            onClick={goBack}
          />
          <h1 className="text-black text-2xl font-bold">Detail Barang</h1>
        </div>

        <div className="flex gap-4">
          <TRDWButton
            variant={ButtonVariant.SECONDARY}
            iconName="bx:edit"
            onClick={handleEditItemDataClicked}
          >
            Edit Barang
          </TRDWButton>
          <TRDWButton
            variant={ButtonVariant.DANGER}
            iconName="tabler:trash"
            onClick={handleDeleteItemDataClicked}
          >
            Hapus Barang
          </TRDWButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 w-full h-full px-4 pt-16">
        <div className="flex flex-col gap-8 w-full h-full">
          {/* Item Data */}
          <div className="flex flex-col gap-6">
            <TRDWLabel title="ID barang" description={itemData.itemId} />
            <TRDWLabel title="Nama barang" description={itemData.name} />
            <TRDWLabel title="Harga per biji (Rp)" description={priceFormatter(itemData.price)} />
            <TRDWLabel title="Stok barang" description={String(itemData.stockQty)} />
            <TRDWLabel title="Vendor">
              <div>{itemData.vendor.name}</div>
            </TRDWLabel>
          </div>

          <div className="flex flex-col gap-3 w-full h-full">
            <div className="w-full flex flex-col gap-2">
              <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onStartDateChanged={setStartDate}
                onEndDateChanged={setEndDate}
                onSearchClicked={handleSearchClicked}
                error={dateError}
              />
            </div>

            <ItemTransactionReportView
              transactionReports={transactionReports}
              handleItemReportClicked={handleItemReportClicked}
              reportMessage={reportMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ItemTransactionReportView = ({
  transactionReports,
  handleItemReportClicked,
  reportMessage,
}: {
  transactionReports: ItemTransactionReport[];
  handleItemReportClicked: (transactionId: number) => void;
  reportMessage: string | undefined;
}) => {
  const [mode, setMode] = useState<string>("summary");

  const checkIsActive = (val: string) => {
    return mode === val;
  };

  if (reportMessage) return <TRDWLoadingView label={reportMessage} />;
  if (transactionReports.length <= 0) return <TRDWEmptyView label={"Tidak ada data transaksi.."} />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <TRTWSelectionTag
          description="Simple"
          isActive={checkIsActive("summary")}
          onClick={() => setMode("summary")}
        />
        <TRTWSelectionTag
          description="Detail"
          isActive={checkIsActive("detail")}
          onClick={() => setMode("detail")}
        />
      </div>
      <ReportModeSelectionView
        mode={mode}
        transactionReports={transactionReports}
        onItemClick={handleItemReportClicked}
      />
    </div>
  );
};

const ReportModeSelectionView = ({
  mode,
  transactionReports,
  onItemClick,
}: {
  mode: string;
  transactionReports: ItemTransactionReport[];
  onItemClick: (transactionId: number) => void;
}) => {
  if (mode === "summary")
    return (
      <div className="flex flex-col w-full">
        <ItemTransactionSummaryView transactions={transactionReports} />
      </div>
    );
  else
    return (
      <ItemTransactionReportListView
        transactionReports={transactionReports}
        onItemClick={onItemClick}
      />
    );
};

const ItemTransactionReportListView = ({
  transactionReports,
  onItemClick,
}: {
  transactionReports: ItemTransactionReport[];
  onItemClick: (transactionId: number) => void;
}) => {
  return (
    <div className="flex w-full h-full items-start">
      <ListViewContainer>
        {transactionReports.map((element) => (
          <ItemTransactionReportCard
            key={element.transactionId}
            report={element}
            onClick={onItemClick}
          />
        ))}
      </ListViewContainer>
    </div>
  );
};

const ItemTransactionSummaryView = ({
  transactions,
}: {
  transactions: ItemTransactionReport[];
}) => {
  if (transactions.length <= 0) return null;
  const tunaiPrice = transactions.reduce((sum, transaction) => {
    if (transaction.transactionType.toLowerCase() === "tunai") return sum + transaction.totalPrice;
    else return sum;
  }, 0);

  const transferPrice = transactions.reduce((sum, transaction) => {
    if (transaction.transactionType.toLowerCase() === "transfer")
      return sum + transaction.totalPrice;
    else return sum;
  }, 0);

  const itemTransactionSummary = GetItemTransactionSummary(transactions);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <ListViewContainer>
          {Array.from(itemTransactionSummary.entries()).map(([price, quantity]) => (
            <CardBackground key={price}>
              <div className="flex gap-2 items-start">
                <TRDWCardLabel width={8} title="Harga Jual" description={priceFormatter(price)} />
                <TRDWCardLabel title="Jumlah terjual" description={formatNumber(quantity)} />
              </div>
            </CardBackground>
          ))}
        </ListViewContainer>
      </div>

      {/* Transaction Amount */}
      <div className="flex flex-col gap-3">
        <p className="font-bold">Jumlah Pembayaran</p>
        <div className="flex flex-col gap-2">
          {tunaiPrice > 0 ? (
            <TRDWLabel title="Tunai">
              <p className="text-mint">{priceFormatter(tunaiPrice)}</p>
            </TRDWLabel>
          ) : null}
          {transferPrice > 0 ? (
            <TRDWLabel title="Transfer">
              <p className="text-blue">{priceFormatter(transferPrice)}</p>
            </TRDWLabel>
          ) : null}
        </div>
      </div>
    </div>
  );
};
