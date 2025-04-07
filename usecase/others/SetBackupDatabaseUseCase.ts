export const SetBackupDatabaseUseCase = async (
  file: File
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append("file", file, "database.sqlite");

    const response = await fetch("/api/backup", {
      method: "POST",
      body: formData,
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
