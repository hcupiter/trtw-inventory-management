import { IAuthService } from "@/services/auth/IAuthService";
import { SQLiteAuthService } from "@/services/auth/SQLiteAuthService";

export const authService: IAuthService = new SQLiteAuthService();
