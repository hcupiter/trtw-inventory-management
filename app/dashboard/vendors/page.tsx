"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import VendorCard from "@/components/ui/vendor/VendorCard";
import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const VendorsPage = () => {
  const router = useRouter();
  const handleAddVendorTappedEvent = () => {
    router.push("/dashboard/vendors/add");
  };

  const handleVendorCardTappedEvent = (id: number) => {
    router.push(`/dashboard/vendors/${id}`);
  };

  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [message, setMessage] = useState<string | null>("Mengambil data...");
  const [allVendors, setAllVendors] = useState<VendorEntity[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorEntity[]>([]);

  // Fetch all vendors on page load
  useEffect(() => {
    const fetchAllVendors = async () => {
      setMessage("Mengambil data...");

      try {
        const response = await fetch(`/api/vendor`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch vendors");
        }

        const mappedVendors: VendorEntity[] =
          data.vendors.map(mapVendorToEntity);
        setAllVendors(mappedVendors);
        setFilteredVendors(mappedVendors); // Default: show all vendors
      } catch (err: any) {
        setMessage(err.message);
      } finally {
        setMessage(null);
      }
    };

    fetchAllVendors();
  }, []); // Run once on component mount

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

  // Filter vendors when search changes
  useEffect(() => {
    if (debouncedSearch.length > 0) {
      // Convert search query to lowercase for case-insensitive matching
      const searchLower = debouncedSearch.toLowerCase();

      const filtered = allVendors.filter((vendor) => {
        const vendorName = vendor.name.toLowerCase();
        const vendorId = String(vendor.id).toLowerCase(); // Ensure id is a string

        return (
          vendorName.includes(searchLower) || vendorId.includes(searchLower)
        );
      });

      setFilteredVendors(filtered);
    } else {
      // Show all vendors if no search query
      setFilteredVendors(allVendors);
    }
  }, [debouncedSearch, allVendors]);

  return (
    <div className="flex flex-col justify-items-start w-full h-full gap-8">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-full">
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
      <div className="flex flex-col w-full h-full items-start justify-items-start gap-6">
        <TRDWSearchBar
          placeholder={"Cari vendor disini..."}
          value={searchText}
          onChange={handleSearchTextInput}
        />

        {/* Data Transaksi */}
        <div className="flex flex-col w-full h-full overflow-x-scroll">
          {message && <TRDWEmptyView label={message} />}

          <div className="flex flex-col gap-8">
            {filteredVendors.length <= 0 ? (
              <TRDWEmptyView label={"Tidak ada data vendor ditemukan..."} />
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  {filteredVendors.map((element) => (
                    <VendorCard
                      key={element.id}
                      vendor={element}
                      onTap={() => handleVendorCardTappedEvent(element.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;
