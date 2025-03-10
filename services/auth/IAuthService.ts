import { UserEntity } from "@/models/entity/UserEntity";

export interface IAuthService {
  getCurrentUser(email: string): Promise<UserEntity | null>;
  login(email: string, password: string): Promise<UserEntity | null>;
  createSessionToken(user: UserEntity): Promise<string>;
}
