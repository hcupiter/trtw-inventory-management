export const ValidatePasswordDatabaseUseCase = async (
  password: string
): Promise<string | undefined> => {
  try {
    if (!password) return Promise.resolve("Password tidak boleh kosong");
    const response = await fetch("/api/backup/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password }),
    });

    const data = await response.json();

    if (!response.ok) return Promise.resolve(data.message);
    return Promise.resolve(undefined);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const ValidateFileDatabaseUseCase = (
  file: File | undefined
): string | undefined => {
  if (!file) return "File tidak ditemukan";
  if (!file.name.endsWith(".sqlite"))
    return "File Database Salah, Harap masukkan file ekstensi .sqlite";
  return undefined;
};
