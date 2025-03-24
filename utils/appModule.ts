import db from "@/database/db";
import { IAuthService } from "@/services/auth/IAuthService";
import { SQLiteAuthService } from "@/services/auth/SQLiteAuthService";
import { IDatabase } from "@/services/database/IDatabase";
import { SQLiteDatabase } from "@/services/database/SQliteDatabase";
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

// Services
export const database: IDatabase = new SQLiteDatabase();

export const authService: IAuthService = new SQLiteAuthService(database);
export const transactionService: ITransactionService =
  new SQLiteTransactionService(database);
export const transactionItemService: ItransactionItemService =
  new SQLiteTransactionItemService(database);
export const itemService: IITemService = new SQLiteItemService(database);
export const vendorService: IVendorService = new SQLiteVendorService(database);
export const transactionTypeService: ITransactionTypeService =
  new SQLiteTransactionTypeService(database);
