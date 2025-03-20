import { VendorDTO } from "@/models/dto/VendorDTO";
import { errorWriter } from "@/utils/errorWriter";

export const saveVendorUseCase = async (dto: VendorDTO): Promise<string> => {
  try {
    const response = await fetch("/api/vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal menyimpan vendor");
    }

    return Promise.resolve(data.message);
  } catch (error) {
    return Promise.reject(error);
  }
};
