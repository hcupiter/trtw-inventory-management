import { TransactionDTO } from "@/models/dto/TransactionDTO";

export const Mocks_TransactionDTO: TransactionDTO[] = [
  {
    id: 1,
    date: new Date(),
    totalPrice: 1000 * 10 + 5 * 10000,
    transactionTypeId: 1,
  },
  {
    id: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 7)), // 1 week ago
    totalPrice: 3 * 1500,
    transactionTypeId: 2,
  },
  {
    id: 3,
    date: new Date(new Date().setDate(new Date().getDate() - 14)), // 2 weeks ago
    totalPrice: 30 * 500,
    transactionTypeId: 1,
  },
];
