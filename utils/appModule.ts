import { IAuthService } from "@/services/auth/IAuthService";
import { SQLiteAuthService } from "@/services/auth/SQLiteAuthService";
import { IITemService } from "@/services/item/IItemService";
import { SQLiteItemService } from "@/services/item/SQLiteItemService";
import { ITransactionService } from "@/services/transaction/ITransactionService";
import { SQLiteTransactionService } from "@/services/transaction/SQLiteTransactionService";
import { ItransactionItemService } from "@/services/transactionItem/ITransactionItemService";
import { SQLiteTransactionItemService } from "@/services/transactionItem/SQLiteTransactionItemService";
import { ITransactionTypeService } from "@/services/transactionType/ITransactionTypeService";
import { SQLiteTransactionTypeService } from "@/services/transactionType/SQLiteTransactionTypeService";
import { IVendorService } from "@/services/vendor/IVendorService";
import { SQLiteVendorService } from "@/services/vendor/SQLiteVendorService";

export const authService: IAuthService = new SQLiteAuthService();
export const transactionService: ITransactionService =
  new SQLiteTransactionService();
export const transactionItemService: ItransactionItemService =
  new SQLiteTransactionItemService();
export const itemService: IITemService = new SQLiteItemService();
export const vendorService: IVendorService = new SQLiteVendorService();
export const transactionTypeService: ITransactionTypeService =
  new SQLiteTransactionTypeService();
