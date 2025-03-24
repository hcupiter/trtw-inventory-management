import { VendorEntity } from "./VendorEntity";

export interface TransactionItem {
  id?: number;
  itemId: string;
  vendor: VendorEntity;
  name: string;
  qty: number;
  sellPrice: number;
  totalPrice: number;
}
