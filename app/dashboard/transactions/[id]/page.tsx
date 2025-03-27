"use client";
import { OverlayConfirmation } from "@/components/ui/shared/confirmation/OverlayConfirmation";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import { useOverlay } from "@/context/OverlayContext";
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
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { deleteTransactionUseCase } from "@/usecase/transaction/DeleteTransactionUseCase";
import { TransactionData } from "@/models/entity/TransactionData";
import { fetchTransactionByIdUseCase } from "@/usecase/transaction/fetch/FetchTransactionByIdUseCase";
import { formatDateToIndonesian } from "@/utils/dateFormatter";
import { TransactionType } from "@/models/entity/TransactionType";
import { TransactionItem } from "@/models/entity/TransactionItem";
import { TransactionItemCard } from "@/components/ui/transaction/item/TransactionItemCard";

export default function Page() {
  const params = useParams<{ id: string }>();
  const transactionIdNumber = Number(params.id);

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const { openOverlay, closeOverlay } = useOverlay();
  const handleDeleteTransactionDataClicked = () => {
    openOverlay({
      overlayContent: (
        <OverlayConfirmation
          title={"Konfirmasi Hapus"}
          description={
            "Apakah anda yakin untuk menghapus transaksi ini? (Transaksi yang dihapus tidak akan bisa dikembalikan dan semua stok barang akan dikembalikan)"
          }
          onConfirm={deleteTransaction}
          onCancel={closeOverlay}
        />
      ),
      isFullScreen: false,
    });
  };

  const deleteTransaction = async () => {
    try {
      const idToDelete = Number(params.id);

      if (!idToDelete)
        throw new Error("Id transaksi yang akan dihapus tidak valid");

      const result = await deleteTransactionUseCase(idToDelete);
      toast.success(result);
      closeOverlay();
      router.push(`/dashboard/transactions`);
    } catch (error) {
      toast.error(errorWriter(error));
      closeOverlay();
    }
  };

  const [transactionData, setTransactionData] = useState<
    TransactionData | undefined
  >();
  const [message, setMessage] = useState<string | undefined>();

  const fetchTransactionData = useCallback(async () => {
    setMessage("Menampilkan data...");

    try {
      const fetchedData = await fetchTransactionByIdUseCase(
        transactionIdNumber
      );
      setTransactionData(fetchedData);
    } catch (error) {
      setMessage(errorWriter(error));
    } finally {
      setMessage(undefined);
    }
  }, [transactionIdNumber]);

  // Fetch transaction data
  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

  if (message) return <TRDWLoadingView label={message} />;
  if (!transactionData)
    return <TRDWEmptyView label="Tidak ada data transaksi" />;

  return (
    <div className="flex flex-col justify-items-start w-full h-full gap-8 overflow-auto no-scrollbar">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-[80vw] bg-white fixed z-50 h-16">
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
            variant={ButtonVariant.DANGER}
            iconName="tabler:trash"
            onClick={handleDeleteTransactionDataClicked}
          >
            Hapus Barang
          </TRDWButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 w-full h-full px-4 pt-16">
        <div className="flex flex-col gap-8 w-full h-full">
          {/* Transaction Data */}
          <div className="flex flex-col gap-6">
            <TRDWLabel
              title="ID transaksi"
              description={String(transactionData.id) || "no-data"}
            />
            <TRDWLabel
              title="Tanggal transaksi"
              description={formatDateToIndonesian(transactionData.date)}
            />
            <TRDWLabel title="Pembayaran">
              <DisplayTransactionType
                transactionType={transactionData.transactionType}
              />
            </TRDWLabel>
            <TRDWLabel
              title="Total Transaksi"
              description={priceFormatter(transactionData.totalPrice)}
            />
          </div>

          {/* Transaction Items */}
          <div className="flex flex-col gap-6 w-full h-full">
            <h1 className="font-bold">Barang terjual</h1>
            <TransactionItemListView
              transactionItems={transactionData.transactionItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const TransactionItemListView = ({
  transactionItems,
}: {
  transactionItems: TransactionItem[];
}) => {
  if (!transactionItems) return <TRDWLoadingView label="Mengambil data..." />;
  if (transactionItems.length <= 0)
    return (
      <TRDWEmptyView label={"Tidak ada barang terjual selama transaksi.."} />
    );

  return (
    <div className="flex w-full h-full items-start">
      <ListViewContainer>
        {transactionItems.map((element) => (
          <TransactionItemCard key={element.id} transactionItem={element} />
        ))}
      </ListViewContainer>
    </div>
  );
};

const DisplayTransactionType = ({
  transactionType,
}: {
  transactionType: TransactionType;
}) => {
  if (transactionType.type.toLowerCase() === "tunai")
    return <p className="text-mint">{transactionType.type}</p>;
  else if (transactionType.type.toLowerCase() === "transfer")
    return <p className="text-blue">{transactionType.type}</p>;
  else return <p>{transactionType.type}</p>;
};
