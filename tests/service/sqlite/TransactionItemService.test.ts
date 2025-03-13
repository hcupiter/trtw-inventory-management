import { TransactionItemDTO } from "@/models/dto/TransactionItemDTO";
import { ItransactionItemService } from "@/services/transactionItem/ITransactionItemService";
import { SQLiteTransactionItemService } from "@/services/transactionItem/SQLiteTransactionItemService";
import Database from "better-sqlite3";

const sortByName = (a: TransactionItemDTO, b: TransactionItemDTO) =>
  a.name.localeCompare(b.name);

const sqliteQuery = `
  CREATE TABLE "TransactionItem" (
    "id"	TEXT NOT NULL,
    "vendorID"	INTEGER NOT NULL,
    "name"	TEXT NOT NULL,
    "qty"	INTEGER NOT NULL,
    "sellPrice"	INTEGER NOT NULL,
    "totalPrice"	INTEGER NOT NULL,
    "transactionID"	INTEGER NOT NULL,
    PRIMARY KEY("id"),
    FOREIGN KEY("transactionID") REFERENCES "TransactionData"("id"),
    FOREIGN KEY("vendorID") REFERENCES "Vendor"("id")
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
    "totalPrice"	INTEGER NOT NULL,
    "transactionTypeID"	INTEGER NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT),
    FOREIGN KEY("transactionTypeID") REFERENCES "TransactionType"("id")
  );
`;

describe("SQLiteTransactionItemService", () => {
  let service: ItransactionItemService;
  let testDb: any;

  beforeEach(() => {
    // Create an in-memory SQLite database
    testDb = new Database(":memory:");

    // Create the Vendor table
    testDb.exec(sqliteQuery);

    // Inject the test database into the service
    service = new SQLiteTransactionItemService(testDb);
  });

  afterEach(() => {
    // Close the database after each test
    testDb.close();
  });
});
