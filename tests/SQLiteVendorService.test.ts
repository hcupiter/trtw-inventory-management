import db from "@/database/db";
import { VendorDTO } from "@/models/dto/VendorDTO";
import { SQLiteVendorService } from "@/services/vendor/SQLiteVendorService";
import Database from "better-sqlite3";

describe("SQLiteVendorService", () => {
  let service: SQLiteVendorService;
  let testDb: any;

  beforeEach(() => {
    // Create an in-memory SQLite database
    testDb = new Database(":memory:");

    // Create the Vendor table
    testDb.exec(`
      CREATE TABLE Vendor (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL
      );
    `);

    // Inject the test database into the service
    service = new SQLiteVendorService(testDb);
  });

  afterEach(() => {
    // Close the database after each test
    testDb.close();
  });

  test("should save a vendor and return its ID", async () => {
    const vendor: VendorDTO = {
      id: "trdw-tugu-wacana",
      name: "Toko Rohani Tugu Wacana",
      address: "123 Test St",
      phone: "555-5555",
    };

    const id = await service.save(vendor);
    expect(id).toBe(vendor.id);

    const result = testDb
      .prepare("SELECT * FROM Vendor WHERE id = ?")
      .get(vendor.id);
    expect(result).toEqual(vendor);
  });
});
