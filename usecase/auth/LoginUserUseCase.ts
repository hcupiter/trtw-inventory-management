import { UserEntity } from "@/models/entity/UserEntity";

export const LoginUserSessionUseCase = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserEntity | null> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) return null;
    return Promise.resolve(data.user);
  } catch (error) {
    return Promise.reject(error);
  }
};
