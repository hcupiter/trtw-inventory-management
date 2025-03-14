import { Mocks_ItemDTO } from "@/__mock__/ItemDTOMock";
import { Mocks_VendorDTO } from "@/__mock__/VendorDTOMock";
import { ItemDTO } from "@/models/dto/ItemDTO";
import { VendorDTO } from "@/models/dto/VendorDTO";
import { IITemService } from "@/services/item/IItemService";
import { SQLiteItemService } from "@/services/item/SQLiteItemService";
import Database from "better-sqlite3";

const sqLiteQuery = `
CREATE TABLE "Item" (
	"id"	TEXT,
	"name"	TEXT NOT NULL,
	"price"	INTEGER NOT NULL,
	"stockQty"	INTEGER NOT NULL,
	"vendorId"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("vendorId") REFERENCES "Vendor"("id")
);

  CREATE TABLE "Vendor" (
    "id"	TEXT,
    "name"	TEXT NOT NULL,
    "address"	TEXT,
    "phone"	TEXT,
    PRIMARY KEY("id")
  );

  INSERT INTO Vendor (id, name) VALUES ('trdw-01', 'Toko Rohani Tugu Wacana');
  INSERT INTO Vendor (id, name) VALUES ('trdw-02', 'Toko Jakarta');
  INSERT INTO Vendor (id, name) VALUES ('trdw-03', 'Bandung');
  INSERT INTO Vendor (id, name) VALUES ('trdw-04', 'Tas Jaya Super');
`;

describe("Item Service Test", () => {
  let service: IITemService;

  let testDb: any;

  beforeEach(() => {
    // Create an in-memory SQLite database
    testDb = new Database(":memory:");

    // Create the Vendor table
    testDb.exec(sqLiteQuery);

    // Inject the test database into the service
    service = new SQLiteItemService(testDb);
  });

  afterEach(() => {
    // Close the database after each test
    testDb.close();
  });

  test("Should save Item and Get by id", async () => {
    const item: ItemDTO = Mocks_ItemDTO[0];

    const saveResult = await service.save(item);
    expect(saveResult).toBe(true);

    const checkSave = await service.getByID(item.id);
    expect(checkSave).toEqual(item);
  });
});
