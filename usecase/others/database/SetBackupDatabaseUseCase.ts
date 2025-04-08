export const SetBackupDatabaseUseCase = async (
  file: File
): Promise<boolean> => {
  try {
    // Get raw binary data from the file.
    const arrayBuffer = await file.arrayBuffer();

    const response = await fetch("/api/backup", {
      method: "POST",
      body: arrayBuffer,
      headers: { "Content-Type": "application/octet-stream" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Gagal untuk memasang backup database"
      );
    }

    return Promise.resolve(true);
  } catch (error) {
    console.log("Error at setBackupDatabase: ", error);
    return Promise.reject(error);
  }
};
