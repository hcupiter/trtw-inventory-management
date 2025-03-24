import { z } from "zod";
import { TransactionDTO, TransactionSchema } from "./TransactionDTO";
import {
  TransactionItemDTO,
  TransactionItemSchema,
} from "./TransactionItemDTO";

export const InsertTransactionSchema = z.object({
  transaction: TransactionSchema,
  items: z.array(TransactionItemSchema),
});

export interface InsertTransactionDTO {
  transaction: TransactionDTO;
  items: TransactionItemDTO[];
}
