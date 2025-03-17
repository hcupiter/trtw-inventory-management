import { VendorDTO } from "@/models/dto/VendorDTO";
import { IDatabase } from "@/services/database/IDatabase";
import { IVendorService } from "@/services/vendor/IVendorService";

export class CreateVendorUseCase {
  private db: IDatabase;
  private vendorService: IVendorService;

  constructor(db: IDatabase, vendorService: IVendorService) {
    this.db = db;
    this.vendorService = vendorService;
  }

  async execute(vendor: VendorDTO) {
    this.db.beginTransaction();

    try {
      // Validate if vendor ID isn't created
      const validateVendorId = await this.vendorService.getById(vendor.id);
      if (validateVendorId)
        throw new Error(
          `Failed to insert, Vendor ID ${vendor.id} has been created...`
        );

      // Save Vendor
      const success = await this.vendorService.save(vendor);
      if (!success) throw new Error(`Failed to save vendor: ${vendor.id}`);

      // Commit Transaction if success
      this.db.commit();
      return true;
    } catch (error) {
      this.db.rollback();
      console.error("Transaction failed:", error);
      return null;
    }
  }
}
