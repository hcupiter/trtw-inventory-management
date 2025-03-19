import { VendorDTO } from "@/models/dto/VendorDTO";

export const saveVendorUseCase = async (dto: VendorDTO): Promise<string> => {
  const response = await fetch("/api/vendor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  const data = await response.json();

  if (!response.ok) {
    return Promise.reject(data.error || "Failed to save vendor");
  }

  return Promise.resolve(data.message);
};
