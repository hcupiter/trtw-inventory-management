export interface TransactionType {
  id: number;
  type: string;
}

export const mapToTransactionType = ({
  text,
}: {
  text: string | undefined;
}): TransactionType | undefined => {
  if (!text) return undefined;

  if (text.toLowerCase() === "transfer")
    return {
      id: 1,
      type: "Transfer",
    };
  else if (text.toLowerCase() === "tunai") return { id: 2, type: "Tunai" };
  return undefined;
};
