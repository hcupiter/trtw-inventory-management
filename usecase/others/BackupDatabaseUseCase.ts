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

    // Create an object URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element and set its attributes for downloading
    const a = document.createElement("a");
    a.href = url;
    a.download = "database.sqlite"; // You can set the desired file name here
    document.body.appendChild(a);
    a.click();

    // Clean up: remove the anchor and revoke the object URL
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
