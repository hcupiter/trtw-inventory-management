import { errorWriter } from "@/utils/errorWriter";

export const validateVendorId = async (
  vendorId?: string,
  currentVendorId?: string
): Promise<string> => {
  try {
    if (!vendorId) return Promise.resolve("Mohon mengisi id vendor");
    if (vendorId.length > 7) return Promise.resolve("ID maksimum 7 karakter");

    if (vendorId === currentVendorId) return Promise.resolve("");

    const response = await fetch(`/api/vendor/get/id?id=${vendorId}`);
    const checkVendor = await response.json();
    if (checkVendor.ok) {
      return Promise.resolve(
        "ID sudah terdaftar sebelumnya, mohon membuat id baru"
      );
    }

    return Promise.resolve("");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const validateVendorName = async (name?: string): Promise<string> => {
  if (!name) return Promise.resolve("Mohon mengisi nama vendor");
  if (name.length > 50) return Promise.resolve("Nama maksimum 25 karakter");
  return Promise.resolve("");
};
