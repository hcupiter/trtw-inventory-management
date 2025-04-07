import { formatDateToYYYYMMDDHHMMSS } from "@/utils/dateFormatter";
import { PromptDownloadUseCase } from "../PromptDownloadUseCase";

export const BackupDatabaseUseCase = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/backup");

    if (!response.ok) {
      // If the response is not OK, try to get the error from the JSON response
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal backup database");
    }

    // Get the file as a Blob
    const blob = await response.blob();

    PromptDownloadUseCase(
      blob,
      `database_${formatDateToYYYYMMDDHHMMSS(new Date())}.sqlite`
    );
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
