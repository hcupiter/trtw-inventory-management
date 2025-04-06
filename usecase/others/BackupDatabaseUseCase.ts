export const BackupDatabaseUseCase = async (): Promise<string> => {
  try {
    const response = await fetch("/api/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Gagal backup database");

    return Promise.resolve(data.message);
  } catch (error) {
    return Promise.reject(error);
  }
};
