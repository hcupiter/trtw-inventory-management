import { NextResponse } from "next/server";
import { authService } from "@/utils/appModule";
import { cookies } from "next/headers";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { UserEntity } from "@/models/entity/UserEntity";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await authService.login(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Generate a session token (this can be a JWT or a session ID)
  const sessionToken = await authService.createSessionToken(user);
  const cookie = await cookies();

  // Set the cookie securely
  cookie.set({
    name: "session",
    value: sessionToken,
    httpOnly: true, // Prevents JavaScript access (more secure)
    secure: process.env.NODE_ENV === "production", // Secure in production
    path: "/", // Available on all routes
    maxAge: 60 * 60 * 24, // 1 day expiration
    sameSite: "lax", // Helps prevent CSRF attacks
  });

  return NextResponse.json({ user });
}

export const loginHandler = ipcMain.handle(
  "/api/auth/login",
  async (
    event: IpcMainInvokeEvent,
    email: string,
    password: string
  ): Promise<UserEntity | null> => {
    try {
      const user = await authService.login(email, password);

      if (!user) return null;

      // Generate a session token.
      const sessionToken = await authService.createSessionToken(user);

      const sender = event.sender;
      const currentSession = sender.session;
      currentSession.cookies
        .set({
          url: "http://localhost", // adjust to match your app's URL or protocol
          name: "session",
          value: sessionToken,
          expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day from now
        })
        .catch((error) => {
          console.error("Failed to set cookie:", error);
        });

      return user;
    } catch (error) {
      console.log("Error at ipc login: ", error);
      return Promise.reject(error);
    }
  }
);
