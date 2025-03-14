import { TransactionDTO } from "@/models/dto/TransactionDTO";

export const Mocks_TransactionDTO: TransactionDTO[] = [
  {
    id: 1,
    date: new Date().toISOString(),
    transactionTypeId: 1,
  },
  {
    id: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), // 1 week ago
    transactionTypeId: 2,
  },
  {
    id: 3,
    date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(), // 2 weeks ago
    transactionTypeId: 1,
  },
];
