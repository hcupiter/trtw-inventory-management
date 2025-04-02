export const TRDWCardTransactionTypeLabel = ({
  label,
  transactionType,
}: {
  label: string;
  transactionType: string;
}) => {
  return (
    <div className="flex flex-col mr-4">
      <p className="text-2xs text-gray">{label}</p>
      <TransactionTypeDisplayer transactionType={transactionType} />
    </div>
  );
};

const TransactionTypeDisplayer = ({ transactionType }: { transactionType: string }) => {
  const lowercased = transactionType.toLowerCase();
  if (lowercased === "transfer")
    return <div className="font-bold text-base text-blue">{transactionType}</div>;
  else if (lowercased === "tunai")
    return <div className="font-bold text-base text-mint">{transactionType}</div>;
};
