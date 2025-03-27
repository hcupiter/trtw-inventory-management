export const fetchTransactionPriceByTransactionId = async (
  id: number
): Promise<number> => {
  try {
    const response = await fetch(`/api/transaction/get/price?id=${id}`);
    const data = await response.json();

    if (!response.ok)
      throw new Error(
        data.error ||
          `Gagal mengambil total transaksi dengan id transaksi ${id}`
      );

    return Promise.resolve(data.sum);
  } catch (error) {
    return Promise.reject(error);
  }
};
