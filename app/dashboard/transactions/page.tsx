"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWDatePicker from "@/components/ui/shared/datepicker/TRDWDatePicker";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import { TransactionData } from "@/models/entity/TransactionData";
import { fetchTransactionByDate } from "@/usecase/transaction/fetch/FetchTransactionByDateUseCase";
import { validateDateQueryUseCase } from "@/usecase/transaction/ValidateDateQueryUseCase";
import { errorWriter } from "@/utils/errorWriter";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const TransactionsPage = () => {
  const router = useRouter();

  const handleAddTransactionTappedEvent = () => {
    console.log("Pressed");
    router.push("/dashboard/transactions/add");
  };

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dateError, setDateError] = useState<string | null>();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
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
      const fetchedTransaction = await fetchTransactionByDate(
        startDate,
        endDate
      );
      setTransactions(fetchedTransaction);
    } catch (error) {
      toast.error(errorWriter(error));
    } finally {
      setMessage(undefined);
      setShouldFetch(false); // Reset fetch flag after completion
    }
  }, [shouldFetch]); // Only depends on `shouldFetch`

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]); // Run only on mount

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
      <div className="flex flex-col w-full h-full items-start justify-items-start">
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
            <TRDWButton
              iconName="material-symbols:search"
              onClick={handleSearch}
            >
              Cari
            </TRDWButton>
          </div>
          {dateError && <span className="text-red">{dateError}</span>}
        </div>

        {/* Data Transaksi */}
        <div className="w-full h-full">
          <TransactionListView transactions={transactions} message={message} />
        </div>
      </div>
    </div>
  );
};

const TransactionListView = ({
  transactions,
  message,
}: {
  transactions: TransactionData[];
  message?: string;
}) => {
  if (message) return <TRDWLoadingView label={message} />;
  if (transactions.length <= 0)
    return <TRDWEmptyView label={"Tidak ada transaksi..."} />;

  return (
    <div className="w-full h-full">
      <ListViewContainer>
        {transactions.map((transaction) => (
          <div key={transaction.id}>{transaction.id}</div>
        ))}
      </ListViewContainer>
    </div>
  );
};

export default TransactionsPage;
