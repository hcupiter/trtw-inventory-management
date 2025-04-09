import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { errorWriter } from "@/utils/errorWriter";
import { ipcMain, IpcMainInvokeEvent } from "electron";

export async function POST() {
  try {
    const cookie = await cookies();
    cookie.delete("session"); // Remove the session cookie

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error at api/auth/logout: ", error);
    return NextResponse.json(
      {
        error: errorWriter(error),
      },
      { status: 500 }
    );
  }
}

export const logoutHandler = ipcMain.handle(
  "/api/auth/logout",
  async (event: IpcMainInvokeEvent): Promise<boolean> => {
    try {
      const sender = event.sender;
      const currentSession = sender.session;

      currentSession.cookies.remove("http://localhost", "session");
      return true;
    } catch (error) {
      console.log("Error at ipc login: ", error);
      return Promise.reject(error);
    }
  }
);
