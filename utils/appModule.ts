import { IAuthService } from "@/services/auth/IAuthService";
import { SQLiteAuthService } from "@/services/auth/SQLiteAuthService";
import { ITransactionService } from "@/services/transaction/ITransactionService";
import { SQLiteTransactionService } from "@/services/transaction/SQLiteTransactionService";
import { ItransactionItemService } from "@/services/transactionItem/ITransactionItemService";
import { SQLiteTransactionItemService } from "@/services/transactionItem/SQLiteTransactionItemService";

export const authService: IAuthService = new SQLiteAuthService();
export const transactionService: ITransactionService =
  new SQLiteTransactionService();
export const transactionItemService: ItransactionItemService =
  new SQLiteTransactionItemService();
