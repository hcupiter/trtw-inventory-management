import { VendorDTO } from "@/models/dto/VendorDTO";
import { QuerySortOrder } from "@/services/utils/QuerySortOrder";
import { IVendorService } from "@/services/vendor/IVendorService";
import { SQLiteVendorService } from "@/services/vendor/SQLiteVendorService";
import Database from "better-sqlite3";

const sortByName = (a: VendorDTO, b: VendorDTO) => a.name.localeCompare(b.name);

describe("SQLiteVendorService", () => {
  let service: IVendorService;
  let testDb: any;

  beforeEach(() => {
    // Create an in-memory SQLite database
    testDb = new Database(":memory:");

    // Create the Vendor table
    testDb.exec(`
      CREATE TABLE Vendor (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        phone TEXT
      );
    `);

    // Inject the test database into the service
    service = new SQLiteVendorService(testDb);
  });

  afterEach(() => {
    // Close the database after each test
    testDb.close();
  });

  test("should save a vendor and get vendor by id", async () => {
    const vendor: VendorDTO = {
      id: "trdw-tugu-wacana",
      name: "Toko Rohani Tugu Wacana",
      address: "123 Test St",
      phone: "555-5555",
    };

    const status = await service.save(vendor);
    expect(status).toBe(true);

    const result = await service.getById(vendor.id);
    expect(result).toEqual(vendor);
  });

  test("should get vendor by id or name", async () => {
    const vendor1: VendorDTO = {
      id: "trdw-tugu-wacana",
      name: "Toko Rohani Tugu Wacana",
      address: "123 Test St",
      phone: "555-5555",
    };

    const vendor2: VendorDTO = {
      id: "toko-jaya-wacana-jakarta",
      name: "Toko Jaya Wacana",
      address: "Jakarta",
      phone: "9191",
    };

    const vendor3: VendorDTO = {
      id: "toko-bj-jakarta",
      name: "Toko Bintang Jaya",
      address: "Bandung",
      phone: "01920",
    };

    await service.save(vendor1);
    await service.save(vendor2);
    await service.save(vendor3);

    const testcase1 = await service.getByNameOrId(
      "toko",
      100,
      0,
      QuerySortOrder.ASC
    );
    expect(testcase1).toEqual([vendor1, vendor2, vendor3].sort(sortByName));

    const testcase2 = await service.getByNameOrId(
      "wacana",
      100,
      0,
      QuerySortOrder.ASC
    );
    expect(testcase2).toEqual([vendor1, vendor2].sort(sortByName));

    const testcase3 = await service.getByNameOrId(
      "jakarta",
      100,
      0,
      QuerySortOrder.ASC
    );
    expect(testcase3).toEqual([vendor2, vendor3].sort(sortByName));
  });

  test("Should return all vendor ordered ascending by name", async () => {
    const vendor1: VendorDTO = {
      id: "trdw-tugu-wacana",
      name: "Toko Rohani Tugu Wacana",
      address: "123 Test St",
      phone: "555-5555",
    };

    const vendor2: VendorDTO = {
      id: "toko-jaya-wacana-jakarta",
      name: "Toko Jaya Wacana",
      address: "Jakarta",
      phone: "9191",
    };

    const vendor3: VendorDTO = {
      id: "toko-bj-jakarta",
      name: "Toko Bintang Jaya",
      address: "Bandung",
      phone: "01920",
    };

    await service.save(vendor1);
    await service.save(vendor2);
    await service.save(vendor3);

    const testcase1 = await service.getAll(1, 0, QuerySortOrder.ASC);
    expect(testcase1.at(0)).toEqual(
      [vendor1, vendor2, vendor3].sort(sortByName).at(0)
    );
  });

  test("Should update vendor data", async () => {
    const vendor1: VendorDTO = {
      id: "trdw-tugu-wacana",
      name: "Toko Rohani Tugu Wacana",
      address: "123 Test St",
      phone: "555-5555",
    };

    const vendor2: VendorDTO = {
      id: "toko-jaya-wacana-jakarta",
      name: "Toko Jaya Wacana",
      address: "Jakarta",
      phone: "9191",
    };

    const toUpdateVendor2: VendorDTO = {
      id: "toko-jaya-wacana-jakarta",
      name: "Toko Jaya Wacana Jakarta",
      address: "Jakarta Pusat",
      phone: "9191100",
    };

    await service.save(vendor1);
    await service.save(vendor2);

    const res = await service.update(toUpdateVendor2);
    expect(res).toBe(true);

    const testcase = await service.getById(vendor2.id);
    expect(testcase).toEqual(toUpdateVendor2);

    const testcase2 = await service.getById(vendor1.id);
    expect(testcase2).toEqual(vendor1);
  });

  test("should delete vendor data", async () => {
    const vendor1: VendorDTO = {
      id: "trdw-tugu-wacana",
      name: "Toko Rohani Tugu Wacana",
      address: "123 Test St",
      phone: "555-5555",
    };

    const vendor2: VendorDTO = {
      id: "toko-jaya-wacana-jakarta",
      name: "Toko Jaya Wacana",
      address: "Jakarta",
      phone: "9191",
    };

    await service.save(vendor1);
    await service.save(vendor2);

    const res = await service.delete(vendor1.id);
    expect(res).toBe(true);

    const testcase1 = await service.getById(vendor1.id);
    expect(testcase1).toBeNull();

    const testcase2 = await service.getById(vendor2.id);
    expect(testcase2).toEqual(vendor2);
  });
});
