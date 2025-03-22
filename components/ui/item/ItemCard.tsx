"use client";

import { ItemEntity } from "@/models/entity/ItemEntity";
import { Icon } from "@iconify/react";
import { VendorTag } from "../vendor/VendorTag";
import { priceFormatter } from "@/utils/priceFormatter";
import { TRDWCardLabel } from "../shared/label/TRDWCardLabel";
import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { useEffect, useState } from "react";
import { CardBackground } from "../shared/cardBackground/CardBackground";

export const ItemCard = ({
  item,
  onTap,
}: {
  item: ItemEntity;
  onTap: () => void;
}) => {
  if (!item.vendor) return <div>No Data</div>;

  return (
    <CardBackground onClick={onTap}>
      <div className="w-full flex flex-row items-center justify-between gap-10">
        <div className="w-full flex flex-col">
          <div className="flex flex-col border-b-1 border-gray-400/75 pb-2 mb-2">
            <p className=" text-lg font-bold">{item.itemId}</p>
          </div>
          <div className="flex gap-4 text-base">
            <TRDWCardLabel
              width={5}
              title={"VendorID"}
              description={item.vendor.vendorId}
            />
            {/* ID and Items name */}
            <TRDWCardLabel
              width={20}
              title={"Nama Barang"}
              description={item.name}
            />

            <TRDWCardLabel
              width={10}
              title={"Harga per biji"}
              description={priceFormatter(item.price)}
            />
            <TRDWCardLabel
              width={10}
              title={"Stok"}
              description={String(item.stockQty)}
            />
          </div>
        </div>

        {/* Icon */}
        <Icon icon={"line-md:chevron-right"} />
      </div>
    </CardBackground>
  );
};
