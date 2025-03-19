"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import VendorCard from "@/components/ui/vendor/VendorCard";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { fetchVendorUseCase } from "@/usecase/vendors/fetch/FetchVendorsUseCase";
import { filterVendorsUseCase } from "@/usecase/vendors/FilterVendorsUseCase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const VendorsPage = () => {
  const router = useRouter();
  const handleAddVendorTappedEvent = () => {
    router.push("/dashboard/vendors/add");
  };

  const handleVendorCardTappedEvent = (id: number) => {
    router.push(`/dashboard/vendors/${id}`);
  };

  const [searchText, setSearchText] = useState<string>("");

  const [message, setMessage] = useState<string | null>("Mengambil data...");
  const [allVendors, setAllVendors] = useState<VendorEntity[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorEntity[]>([]);

  // Fetch all vendors on page load
  useEffect(() => {
    const fetchAllVendors = async () => {
      setMessage("Mengambil data...");

      try {
        const fetched = await fetchVendorUseCase();
        setAllVendors(fetched);
        setFilteredVendors(fetched); // Default: show all vendors
      } catch (err: any) {
        setMessage(err.message);
      } finally {
        setMessage(null);
      }
    };

    fetchAllVendors();
  }, []); // Run once on component mount

  const handleSearchTextInput = (value: string) => {
    setSearchText(value);
  };

  // Filter vendors when search changes
  useEffect(() => {
    if (searchText.length > 0) {
      const filtered = filterVendorsUseCase(searchText, allVendors);
      setFilteredVendors(filtered);
    } else {
      // Show all vendors if no search query
      setFilteredVendors(allVendors);
    }
  }, [searchText, allVendors]);

  if (message) return <TRDWLoadingView label={message} />;

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
          <div className="flex flex-col gap-8">
            {filteredVendors.length <= 0 ? (
              <TRDWEmptyView label={"Tidak ada data vendor ditemukan..."} />
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
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
