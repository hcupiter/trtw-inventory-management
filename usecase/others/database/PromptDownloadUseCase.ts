export const PromptDownloadUseCase = (blob: Blob, fileName: string) => {
  // Create an object URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create an anchor element and set its attributes for downloading
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // Clean up: remove the anchor and revoke the object URL
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
