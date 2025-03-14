import { Mocks_ItemDTO } from "@/__mock__/ItemDTOMock";
import { Mocks_TransactionDTO } from "@/__mock__/TransactionDTOMock";
import { Mocks_VendorDTO } from "@/__mock__/VendorDTOMock";
import { ItemDTO } from "@/models/dto/ItemDTO";
import { TransactionDTO } from "@/models/dto/TransactionDTO";
import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import { VendorDTO } from "@/models/dto/VendorDTO";
import { ITransactionService } from "@/services/transaction/ITransactionService";
import { SQLiteTransactionService } from "@/services/transaction/SQLiteTransactionService";
import { ItransactionItemService } from "@/services/transactionItem/ITransactionItemService";
import { SQLiteTransactionItemService } from "@/services/transactionItem/SQLiteTransactionItemService";
import Database from "better-sqlite3";

const sqliteQuery = `
CREATE TABLE "Item" (
	"id"	TEXT,
	"name"	TEXT NOT NULL,
	"price"	INTEGER NOT NULL,
	"stockQty"	INTEGER NOT NULL,
	"vendorId"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("vendorId") REFERENCES "Vendor"("id")
);

  CREATE TABLE "TransactionItem" (
    "id"	TEXT NOT NULL,
    "vendorId"	TEXT NOT NULL,
    "name"	TEXT NOT NULL,
    "qty"	INTEGER NOT NULL,
    "sellPrice"	INTEGER NOT NULL,
    "transactionId"	INTEGER NOT NULL,
    PRIMARY KEY("id"),
    FOREIGN KEY("transactionId") REFERENCES "TransactionData"("id"),
    FOREIGN KEY("vendorId") REFERENCES "Vendor"("id")
  );

  CREATE TABLE "Vendor" (
    "id"	TEXT,
    "name"	TEXT NOT NULL,
    "address"	TEXT,
    "phone"	TEXT,
    PRIMARY KEY("id")
  );

  CREATE TABLE "TransactionData" (
    "id"	INTEGER,
    "date"	DATETIME NOT NULL,
    "transactionTypeId"	INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT),
    FOREIGN KEY("transactionTypeId") REFERENCES "TransactionType"("id")
  );

  CREATE TABLE "TransactionType" (
	  "id"	INTEGER,
    "type"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  );

  INSERT INTO TransactionType (id, type) VALUES (1, 'Transfer');
  INSERT INTO TransactionType (id, type) VALUES (2, 'Tunai');

  INSERT INTO Vendor (id, name) VALUES ('trdw-01', 'Toko Rohani Tugu Wacana');
  INSERT INTO Vendor (id, name) VALUES ('trdw-02', 'Toko Jakarta');
  INSERT INTO Vendor (id, name) VALUES ('trdw-03', 'Bandung');
  INSERT INTO Vendor (id, name) VALUES ('trdw-04', 'Tas Jaya Super');

  INSERT INTO Item (id, name, price, stockQty, vendorId) VALUES ('barang-01', 'Patung Salib Yesus Kristus Warna Coklat', 1000, 100, 'trdw-01');
  INSERT INTO Item (id, name, price, stockQty, vendorId) VALUES ('barang-02', 'Patung Bunda Maria', 10000, 90, 'trdw-02');
  INSERT INTO Item (id, name, price, stockQty, vendorId) VALUES ('barang-03', 'Kalung Rosario', 1500, 80, 'trdw-02');
  INSERT INTO Item (id, name, price, stockQty, vendorId) VALUES ('barang-04', 'Buku Rohani', 500, 90, 'trdw-03');
`;

describe("SQLiteTransactionItemService", () => {
  let transactionService: ITransactionService;
  let transactionItemService: ItransactionItemService;

  let testDb: any;

  beforeEach(() => {
    // Create an in-memory SQLite database
    testDb = new Database(":memory:");

    // Create the Vendor table
    testDb.exec(sqliteQuery);

    // Inject the test database into the service
    transactionService = new SQLiteTransactionService(testDb);
    transactionItemService = new SQLiteTransactionItemService(testDb);
  });

  afterEach(() => {
    // Close the database after each test
    testDb.close();
  });

  test("Should save a Transaction Data", async () => {
    const item: ItemDTO = Mocks_ItemDTO[0];
    const vendor: VendorDTO = Mocks_VendorDTO[0];
    const transaction: TransactionDTO = Mocks_TransactionDTO[0];
    const transactionItem: TransactionItemDTO = {
      id: item.id,
      vendorId: vendor.id,
      name: item.name,
      qty: 10,
      sellPrice: item.price,
      transactionId: transaction.id,
    };

    const transactionResult = await transactionService.save(transaction);
    expect(transactionResult).toBe(transaction.id);

    const transactionItemResult = await transactionItemService.save(
      transactionItem
    );
    expect(transactionItemResult).toBe(true);

    const data = await transactionItemService.getByItemID(item.id);
    expect(data).toEqual(transactionItem);

    const data2 = await transactionService.getById(transaction.id);
    expect(data2).toEqual(transaction);
  });
});
