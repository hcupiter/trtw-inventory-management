import { UserEntity } from "@/models/entity/UserEntity";

export const FetchUserSessionUseCase = async (): Promise<UserEntity | null> => {
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) return Promise.resolve(null);
    return Promise.resolve(data.user);
  } catch (error) {
    console.error("Session fetch failed:", error);
    return Promise.reject(error);
  }
};
