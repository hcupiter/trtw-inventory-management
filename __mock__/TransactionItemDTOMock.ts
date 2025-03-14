import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";

export const Mocks_TransactionItemDTO: TransactionItemDTO[] = [
  {
    id: "barang-01",
    vendorId: "trdw-01",
    name: "Patung Salib Yesus Kristus Warna Coklat",
    qty: 10,
    sellPrice: 1000,
    transactionId: 1,
  },

  {
    id: "barang-02",
    vendorId: "trdw-02",
    name: "Patung Bunda Maria",
    qty: 5,
    sellPrice: 10000,
    transactionId: 1,
  },

  {
    id: "barang-03",
    vendorId: "trdw-02",
    name: "Kalung Rosario",
    qty: 3,
    sellPrice: 1500,
    transactionId: 2,
  },

  {
    id: "barang-04",
    vendorId: "trdw-03",
    name: "Buku Rohani",
    qty: 30,
    sellPrice: 500,
    transactionId: 3,
  },
];
