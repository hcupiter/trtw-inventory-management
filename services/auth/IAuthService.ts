import { UserEntity } from "@/models/entity/UserEntity";

export interface IAuthService {
  getCurrentUser(email: String): Promise<UserEntity | null>;
  login(email: String, password: String): Promise<UserEntity | null>;
}
