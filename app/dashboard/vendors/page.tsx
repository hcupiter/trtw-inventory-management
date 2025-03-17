"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import { useState, useEffect } from "react";

const VendorsPage = () => {
  const handleAddVendorTappedEvent = () => {};

  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500); // 500ms debounce time

    return () => clearTimeout(handler);
  }, [searchText]);

  const handleSearchTextInput = (value: string) => {
    setSearchText(value);
  };

  return (
    <div className="flex flex-col justify-items-start w-full h-full gap-8">
      {/* Top Title */}
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="text-black text-2xl font-bold">Vendor</h1>
        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          iconName="ic:baseline-plus"
          onClick={handleAddVendorTappedEvent}
        >
          Tambah Vendor
        </TRDWButton>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full h-full items-start justify-items-start">
        <TRDWSearchBar
          placeholder={"Cari vendor disini..."}
          value={searchText}
          onChange={handleSearchTextInput}
        />
        {debouncedSearch.length > 0 && <p>{debouncedSearch}</p>}

        {/* Data Transaksi */}
        <div className="w-full h-full">
          <TRDWEmptyView label={"Tidak ada data vendor..."} />
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;
