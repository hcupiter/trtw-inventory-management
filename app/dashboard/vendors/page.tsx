"use client";

import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import VendorCard from "@/components/ui/vendor/VendorCard";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { fetchVendorUseCase } from "@/usecase/vendors/fetch/FetchVendorsUseCase";
import { filterVendorsUseCase } from "@/usecase/vendors/FilterVendorsUseCase";
import { errorWriter } from "@/utils/errorWriter";
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
      } catch (error) {
        setMessage(errorWriter(error));
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
        <div className="w-full max-h-[75vh]">
          <VendorListView
            vendors={filteredVendors}
            onClick={handleVendorCardTappedEvent}
          />
        </div>
      </div>
    </div>
  );
};

const VendorListView = ({
  vendors,
  onClick,
}: {
  vendors: VendorEntity[];
  onClick: (id: number) => void;
}) => {
  if (vendors.length <= 0)
    return <TRDWEmptyView label={"Tidak ada data vendor ditemukan..."} />;
  return (
    <ListViewContainer>
      {vendors.map((element) => (
        <VendorCard
          key={element.id}
          vendor={element}
          onTap={() => onClick(element.id)}
        />
      ))}
    </ListViewContainer>
  );
};

export default VendorsPage;
