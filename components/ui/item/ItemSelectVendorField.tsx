import { VendorEntity } from "@/models/entity/VendorEntity";
import TRDWButton, { ButtonVariant } from "../shared/button/TRDWButton";

export const ItemSelectVendorField = ({
  label,
  mandatory,
  vendor,
  error,
  onVendorChangeTapped,
}: {
  label: string;
  mandatory?: boolean;
  vendor?: VendorEntity;
  error?: string;
  onVendorChangeTapped: () => void;
}) => {
  return (
    <div className="flex w-full justify-between">
      {/* Label */}
      <div className={"flex w-full flex-col items-start justify-start gap-3"}>
        <div className="flex w-full flex-col items-start justify-start">
          <label className={"text-base text-black font-bold"}>
            {label} {mandatory && <span className={"text-red"}>*</span>}
          </label>
          <div className="flex flex-col items-start w-full">
            {vendor ? (
              <div className="text-base flex gap-1">
                {vendor.name}
                <p className="font-bold text-blue">{`(${vendor.vendorId})`}</p>
              </div>
            ) : (
              <p className="text-base pl-1">-</p>
            )}
            {error && <p className={"text-base text-red"}>{error}</p>}
          </div>
        </div>
        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          onClick={onVendorChangeTapped}
        >
          Pilih Vendor
        </TRDWButton>
      </div>
    </div>
  );
};
