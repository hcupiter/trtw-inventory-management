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
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { TRDWLabel } from "@/components/ui/shared/label/TRDWLabel";
import { priceFormatter } from "@/utils/priceFormatter";
import { DateRangeSelector } from "@/components/ui/shared/dateRangeSelector/DateRangeSelector";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { ItemTransactionReportCard } from "@/components/ui/item/ItemTransactionReportCard";

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

      if (!idToDelete)
        throw new Error("Id barang yang akan dihapus tidak valid");

      const result = await deleteItemUseCase(idToDelete);
      toast.success(result);
      closeOverlay();
      router.push(`/dashboard/items`);
    } catch (error) {
      toast.error(errorWriter(error));
      closeOverlay();
    }
  };

  const [itemData, setItemData] = useState<ItemEntity | null>();
  const [message, setMessage] = useState<string | null>();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [transactionReports, setTransactionReports] = useState<
    ItemTransactionReport[]
  >([]);

  const [reportMessage, setReportMessage] = useState<string | undefined>();

  const fetchItemData = useCallback(async () => {
    setMessage("Menampilkan data...");

    try {
      const fetchedItemData = await fetchItemByIdUseCase(idNumber);
      setItemData(fetchedItemData);
    } catch (error) {
      setMessage(errorWriter(error));
    } finally {
      setMessage(null);
    }
  }, [idNumber]);

  const fetchTransactionReportData = useCallback(async () => {
    setReportMessage("Mengambil data...");
    try {
      const fetchedTransactionReports = await fetchItemTransactionReportUseCase(
        idNumber,
        startDate,
        endDate
      );
      setTransactionReports(fetchedTransactionReports);
    } catch (error) {
      toast.error(errorWriter(error));
    } finally {
      setReportMessage(undefined);
    }
  }, [idNumber, startDate, endDate]);

  // Fetch Vendor Details
  useEffect(() => {
    fetchItemData();
    fetchTransactionReportData();
  }, [fetchItemData, fetchTransactionReportData]);

  const handleSearchClicked = () => {
    fetchTransactionReportData();
  };

  const handleItemReportClicked = (transactionId: number) => {
    // TODO
    console.log(`transactionId ${transactionId} is clicked`);
  };

  if (message) return <TRDWLoadingView label={message} />;
  if (!itemData) return <TRDWEmptyView label="Tidak ada data barang" />;

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
      <div className="flex flex-col gap-6 w-full h-full px-4">
        <div className="flex flex-col gap-8 w-full h-full">
          {/* Vendor Data */}
          <div className="flex flex-col gap-6">
            <TRDWLabel title="ID barang" description={itemData.itemId} />
            <TRDWLabel title="Nama barang" description={itemData.name} />
            <TRDWLabel
              title="Harga per biji (Rp)"
              description={priceFormatter(itemData.price)}
            />
            <TRDWLabel
              title="Stok barang"
              description={String(itemData.stockQty)}
            />
            <TRDWLabel title="Vendor">
              <div>{itemData.vendor.name}</div>
            </TRDWLabel>
          </div>

          {/* Vendor Registered Items */}
          <div className="flex flex-col gap-6 w-full h-full">
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChanged={setStartDate}
              onEndDateChanged={setEndDate}
              onSearchClicked={handleSearchClicked}
            />

            <ItemTransactionReportListView
              transactionReports={transactionReports}
              onItemClick={handleItemReportClicked}
              reportMessage={reportMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ItemTransactionReportListView = ({
  transactionReports,
  reportMessage,
  onItemClick,
}: {
  transactionReports: ItemTransactionReport[];
  reportMessage?: string;
  onItemClick: (transactionId: number) => void;
}) => {
  if (reportMessage) return <TRDWLoadingView label={reportMessage} />;
  if (transactionReports.length <= 0)
    return <TRDWEmptyView label={"Tidak ada data transaksi.."} />;

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
