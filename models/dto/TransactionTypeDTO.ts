import { TransactionType } from "../entity/TransactionType";
import { z } from "zod";

export const TransactionTypeSchema = z.object({
  id: z.number(),
  type: z.string(),
});

export interface TransactionTypeDTO {
  id: number;
  type: string;
}

export const mapTransactionTypeToEntity = (
  dto: TransactionTypeDTO
): TransactionType => {
  return {
    id: dto.id,
    type: dto.type,
  };
};
