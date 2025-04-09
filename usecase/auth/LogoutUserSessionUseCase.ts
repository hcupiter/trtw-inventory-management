// export const LogoutUserSessionUseCase = async (): Promise<boolean> => {
//   try {
//     const response = await fetch("/api/auth/logout", {
//       method: "POST",
//       credentials: "include",
//     });

import { ipcRenderer } from "electron";

//     const data = await response.json();

//     if (!response.ok) throw new Error("Gagal logout");
//     return Promise.resolve(data.message ? true : false);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

export const LogoutUserSessionUseCase = async (): Promise<boolean> => {
  try {
    const result: boolean = await ipcRenderer.invoke("/api/auth/logout");
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};
