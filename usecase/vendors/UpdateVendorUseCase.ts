import { VendorDTO } from "@/models/dto/VendorDTO";
import { IDatabase } from "@/services/database/IDatabase";
import { IVendorService } from "@/services/vendor/IVendorService";

export class UpdateVendorUseCase {
  private db: IDatabase;
  private vendorService: IVendorService;

  constructor(db: IDatabase, vendorService: IVendorService) {
    this.db = db;
    this.vendorService = vendorService;
  }

  async execute(vendor: VendorDTO): Promise<boolean> {
    this.db.beginTransaction();

    try {
      if (!vendor.id) throw new Error(`Missing Vendor ID!`);
      // Validate if vendor ID has been found
      const validateVendorId = await this.vendorService.getById(vendor.id);
      if (!validateVendorId)
        throw new Error(
          `Failed to update, Vendor ID ${vendor.id} is not found...`
        );

      // Update Vendor
      const success = await this.vendorService.update(vendor);
      if (!success) throw new Error(`Failed to update vendor: ${vendor.id}`);

      // Commit Transaction if success
      this.db.commit();
      return Promise.resolve(true);
    } catch (error) {
      this.db.rollback();
      console.error("Transaction failed:", error);
      return Promise.reject(error);
    }
  }
}
