"use client";

import { VendorEntity } from "@/models/entity/VendorEntity";
import { useEffect, useState } from "react";
import { TRDWLoadingView } from "../shared/loading/TRDWLoadingView";
import { fetchVendorUseCase } from "@/usecase/vendors/fetch/FetchVendorsUseCase";
import { errorWriter } from "@/utils/errorWriter";
import TRDWSearchBar from "../shared/searchbar/TRDWSearchBar";
import TRDWButton, { ButtonVariant } from "../shared/button/TRDWButton";
import { VendorTag } from "../vendor/VendorTag";
import { OverlayContentTitle } from "../shared/overlay/OverlayContentTitle";
import { OverlayContentContainer } from "../shared/overlay/OverlayContentContainer";
import { ListViewContainer } from "../shared/listViewContainer/ListViewContainer";
import { filterVendorsUseCase } from "@/usecase/vendors/FilterVendorsUseCase";

export const ItemSelectVendorView = ({
  onSelect,
  onCancel,
}: {
  onSelect: (vendor: VendorEntity) => void;
  onCancel: () => void;
}) => {
  const [vendors, setVendors] = useState<VendorEntity[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorEntity[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    const fetchVendor = async () => {
      setMessage("Sedang mengambil data vendor...");
      try {
        const fetched = await fetchVendorUseCase();
        setVendors(fetched);
        setFilteredVendors(fetched);
      } catch (error) {
        setMessage(errorWriter(error));
      } finally {
        setMessage(undefined);
      }
    };

    fetchVendor();
  }, []);

  const handleVendorTapped = (vendor: VendorEntity) => {
    onSelect(vendor);
    onCancel();
  };

  useEffect(() => {
    const filtered = filterVendorsUseCase(searchText, vendors);
    setFilteredVendors(filtered);
  }, [searchText]);

  if (message) return <TRDWLoadingView label={message} />;

  return (
    <OverlayContentContainer>
      {/* Title */}
      <OverlayContentTitle title={"Pilih Vendor"} onCancel={onCancel} />

      {/* Search Bar */}
      <TRDWSearchBar
        placeholder={"Masukkan Vendor yang ingin dicari"}
        value={searchText}
        onChange={(query) => {
          setSearchText(query);
        }}
      />

      {/* Content */}
      <div className="flex w-full h-full">
        <div className="flex w-full max-h-[40vh]">
          <ListViewContainer scrollable>
            {filteredVendors.map((element) => (
              <ItemVendorSelectVendorCard
                key={element.id}
                vendor={element}
                onTap={(vendor) => {
                  handleVendorTapped(vendor);
                }}
              />
            ))}
          </ListViewContainer>
        </div>
      </div>
    </OverlayContentContainer>
  );
};

const ItemVendorSelectVendorCard = ({
  vendor,
  onTap,
}: {
  vendor: VendorEntity;
  onTap: (vendor: VendorEntity) => void;
}) => {
  return (
    <div className="flex w-full items-center justify-between bg-white-smoke p-4 rounded-lg">
      {/* Label */}
      <div className="flex gap-4 items-center">
        <div className="w-24">
          <VendorTag tag={vendor.vendorId} />
        </div>
        <div className="w-112 flex flex-col">
          <p className="text-xs text-gray">Nama Vendor</p>
          <p className="text-base text-black font-bold">{vendor.name}</p>
        </div>
      </div>

      {/* Select  */}
      <div className="flex w-fit">
        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          onClick={() => {
            onTap(vendor);
          }}
        >
          Pilih
        </TRDWButton>
      </div>
    </div>
  );
};
