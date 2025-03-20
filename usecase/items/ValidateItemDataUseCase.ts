import { VendorEntity } from "@/models/entity/VendorEntity";
import { errorWriter } from "@/utils/errorWriter";

export const validateItemId = async (itemId?: string): Promise<string> => {
  if (!itemId) return Promise.resolve("ID barang wajib diisi");
  if (itemId.length > 7)
    return Promise.resolve("ID barang maksimal 7 karakter");

  try {
    const response = await fetch(`/api/item/get/itemId?id=${itemId}`);

    if (response.ok)
      return Promise.resolve(
        "Mohon menggunakan ID lain karena ID barang sudah pernah digunakan sebelumnya!"
      );

    return Promise.resolve("");
  } catch (error) {
    return Promise.resolve(errorWriter(error));
  }
};

export const validateItemName = (name?: string): string => {
  if (!name) return "Nama barang wajib diisi";
  if (name.length > 40) return "Nama Barang tidak boleh melebihi 40 karakter";
  return "";
};

export const validateItemPrice = (price?: number): string => {
  if (!price) return "Harga barang per biji wajib diisi";
  if (price <= 0) return "Harga barang tidak boleh nol";
  return "";
};

export const validateItemStock = (stock?: number): string => {
  if (!stock) return "Stok barang wajib diisi";
  if (stock < 0) return "Jumlah stok tidak boleh negatif";
  return "";
};

export const validateItemVendor = async (
  vendor?: VendorEntity
): Promise<string> => {
  if (!vendor) return Promise.resolve("Vendor harus diisi");
  try {
    const response = await fetch(`api/vendor/get/id?`);
    if (!response.ok)
      return Promise.resolve("Vendor tidak valid, mohon memilih vendor ulang");
  } catch (error) {
    return Promise.resolve(errorWriter(error));
  } finally {
    return Promise.resolve("");
  }
};
