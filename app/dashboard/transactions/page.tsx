"use client";

import TRDWButton, { ButtonVariant } from "@/components/ui/shared/button/TRDWButton";
import TRDWDatePicker from "@/components/ui/shared/datepicker/TRDWDatePicker";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { TRDWLabel } from "@/components/ui/shared/label/TRDWLabel";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import { TransactionCard } from "@/components/ui/transaction/TransactionCard";
import { TransactionSummary } from "@/models/entity/TransactionSummary";
import { fetchTransactionByDate } from "@/usecase/transaction/fetch/FetchTransactionByDateUseCase";
import { validateDateQueryUseCase } from "@/usecase/transaction/ValidateDateQueryUseCase";
import { errorWriter } from "@/utils/errorWriter";
import { priceFormatter } from "@/utils/priceFormatter";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const TransactionsPage = () => {
  const router = useRouter();

  const handleAddTransactionTappedEvent = () => {
    router.push("/dashboard/transactions/add");
  };

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dateError, setDateError] = useState<string | null>();
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [message, setMessage] = useState<string>();
  const [shouldFetch, setShouldFetch] = useState<boolean>(true); // Flag for initial fetch

  const handleSearch = () => {
    const isDateValid = validateDate();
    if (isDateValid) {
      setShouldFetch(true); // Allow fetching on user action
      fetchTransactionData();
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

  const fetchTransactionData = useCallback(async () => {
    if (!shouldFetch) return; // Prevent unnecessary fetching

    try {
      setMessage("Sedang mengambil data...");
      const fetchedTransaction = await fetchTransactionByDate(startDate, endDate);
      setTransactions(fetchedTransaction);
    } catch (error) {
      toast.error(errorWriter(error));
    } finally {
      setMessage(undefined);
      setShouldFetch(false); // Reset fetch flag after completion
    }
  }, [shouldFetch, startDate, endDate]); // Only depends on `shouldFetch`

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]); // Run only on mount

  const handleTransactionCardClicked = (transactionId?: number) => {
    if (!transactionId) toast.error("Tidak ada transaksi id");
    router.push(`/dashboard/transactions/${transactionId}`);
  };

  return (
    <div className="flex flex-col justify-items-start w-full h-full">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-full">
        <h1 className="text-black text-2xl font-bold">Transaksi</h1>
        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          iconName="ic:baseline-plus"
          onClick={handleAddTransactionTappedEvent}
        >
          Tambah transaksi
        </TRDWButton>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full h-full items-start justify-items-start gap-8">
        {/* Durasi Transaksi */}
        <div className="flex flex-col w-full gap-2">
          <p className="flex text-base font-bold">Durasi transaksi</p>
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
            <TRDWButton iconName="material-symbols:search" onClick={handleSearch}>
              Cari
            </TRDWButton>
          </div>
          {dateError && <span className="text-red">{dateError}</span>}
        </div>

        {/* Data Transaksi */}
        <div className="w-full h-full">
          <TransactionListView
            transactions={transactions}
            message={message}
            onClick={handleTransactionCardClicked}
          />
        </div>
      </div>
    </div>
  );
};

const TransactionListView = ({
  transactions,
  message,
  onClick,
}: {
  transactions: TransactionSummary[];
  message?: string;
  onClick: (transactionId?: number) => void;
}) => {
  if (message) return <TRDWLoadingView label={message} />;
  if (transactions.length <= 0) return <TRDWEmptyView label={"Tidak ada transaksi..."} />;

  return (
    <div className="w-full max-h-[70vh] flex flex-col gap-2">
      <h1 className="font-bold text-base">Daftar Transaksi</h1>
      <ListViewContainer>
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id || uuidv4()}
            transaction={transaction}
            onClick={() => {
              onClick(transaction.id);
            }}
          />
        ))}
      </ListViewContainer>
      <TransactionPaymentSummaryView transactions={transactions} />
    </div>
  );
};

const TransactionPaymentSummaryView = ({
  transactions,
}: {
  transactions: TransactionSummary[];
}) => {
  const tunaiPrice = transactions.reduce((sum, transaction) => {
    if (transaction.transactionType.type.toLowerCase() === "tunai")
      return sum + transaction.totalPrice;
    else return sum;
  }, 0);

  const transferPrice = transactions.reduce((sum, transaction) => {
    if (transaction.transactionType.type.toLowerCase() === "transfer")
      return sum + transaction.totalPrice;
    else return sum;
  }, 0);

  console.log("Tunai Price, Transfer price", tunaiPrice, transferPrice);

  return (
    <div className="flex flex-col gap-3 mt-4">
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
  );
};

export default TransactionsPage;
