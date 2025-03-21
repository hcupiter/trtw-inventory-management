export const deleteItemUseCase = async (id: number): Promise<string> => {
  try {
    const response = await fetch(`/api/item?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Gagal Menghapus data");
    return Promise.resolve(data.message);
  } catch (error) {
    return Promise.reject(error);
  }
};
