import { VendorEntity } from "@/models/entity/VendorEntity";
import { Icon } from "@iconify/react";

export const VendorCard = ({ vendor }: { vendor: VendorEntity }) => {
  return (
    <div className="flex bg-white-smoke rounded-lg items-center justify-between px-5 py-3 hover:bg-gray-200">
      <div className="">
        <div className="flex gap-1 text-lg font-bold">
          <p>ID:</p>
          <p className="text-blue">{vendor.id}</p>
        </div>
        <p className="text-lg">{vendor.name}</p>
      </div>
      <Icon icon={"line-md:chevron-right"} className="w-5 h-5" />
    </div>
  );
};

export default VendorCard;
