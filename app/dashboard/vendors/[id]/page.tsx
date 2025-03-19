"use client";

import { ItemCard } from "@/components/ui/item/ItemCard";
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import { OverlayConfirmation } from "@/components/ui/shared/confirmation/OverlayConfirmation";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { TRDWLabel } from "@/components/ui/shared/label/TRDWLabel";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import { useOverlay } from "@/context/OverlayContext";
import { mapItemToEntity } from "@/models/dto/ItemDTO";
import { mapVendorToEntity } from "@/models/dto/VendorDTO";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { fetchItemsByVendorIdUseCase } from "@/usecase/items/fetch/FetchItemsByVendorIdUseCase";
import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import { errorWriter } from "@/utils/errorWriter";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const handleEditVendorDataClick = () => {
    router.push(`/dashboard/vendors/${params.id}/edit`);
  };

  const { openOverlay, closeOverlay } = useOverlay();
  const handleDeleteVendorDataClick = () => {
    openOverlay(
      <OverlayConfirmation
        title={"Konfirmasi Hapus"}
        description={"Apakah anda yakin untuk menghapus vendor ini?"}
        onConfirm={deleteVendor}
        onCancel={closeOverlay}
      />
    );
  };

  const deleteVendor = async () => {
    try {
      const response = await fetch(`/api/vendor?id=${params.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Gagal Menghapus data");

      toast.success(data.message);
      closeOverlay();
      router.push(`/dashboard/vendors`);
    } catch (error) {
      toast.error(errorWriter(error));
      closeOverlay();
    }
  };

  const [vendorData, setVendorData] = useState<VendorEntity | null>();
  const [message, setMessage] = useState<string | null>();

  const [searchText, setSearchText] = useState<string>("");
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemEntity[]>([]);

  const handleSearchTextInput = (query: string) => {
    setSearchText(query);
  };

  // Fetch Vendor Details
  useEffect(() => {
    const fetchVendorData = async () => {
      setMessage("Menampilkan data...");

      try {
        const fetchedVendor = await fetchVendorByIdUseCase(Number(params.id));
        const fetchedItems = await fetchItemsByVendorIdUseCase(
          Number(params.id)
        );
        setVendorData(fetchedVendor);
        setItems(fetchedItems);
        setFilteredItems(fetchedItems);
      } catch (err: any) {
        setMessage(err.message);
      } finally {
        setMessage(null);
      }
    };

    fetchVendorData();
  }, []);

  useEffect(() => {
    if (searchText.length <= 0) {
      setFilteredItems(items);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemId = String(item.id).toLowerCase(); // Ensure id is a string

      return itemName.includes(searchLower) || itemId.includes(searchLower);
    });

    setFilteredItems(filtered);
  }, [searchText]);

  if (message) return <TRDWLoadingView label={message} />;

  return (
    <div className="flex flex-col justify-items-start w-full h-full gap-8">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex gap-5 items-center">
          <Icon
            icon={"heroicons-outline:chevron-left"}
            className="w-7 h-7 hover:text-blue"
            onClick={goBack}
          />
          <h1 className="text-black text-2xl font-bold">Detail Vendor</h1>
        </div>

        <div className="flex gap-4">
          <TRDWButton
            variant={ButtonVariant.SECONDARY}
            iconName="bx:edit"
            onClick={handleEditVendorDataClick}
          >
            Edit Vendor
          </TRDWButton>
          <TRDWButton
            variant={ButtonVariant.DANGER}
            iconName="tabler:trash"
            onClick={handleDeleteVendorDataClick}
          >
            Hapus Vendor
          </TRDWButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 w-full h-full px-4">
        {vendorData && (
          <div className="flex flex-col gap-8 w-full h-full">
            {/* Vendor Data */}
            <div className="flex flex-col gap-6">
              <TRDWLabel title="ID">
                <p className="text-blue">{vendorData.vendorId}</p>
              </TRDWLabel>
              <TRDWLabel title="Nama" description={vendorData.name} />
              <TRDWLabel
                title="Alamat"
                description={vendorData.address || "-"}
              />
              <TRDWLabel
                title="Nomor Telepon"
                description={vendorData.phone || "-"}
              />
            </div>

            {/* Vendor Registered Items */}
            <div className="flex flex-col gap-6 w-full h-full">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold">Barang terdaftar</p>
                <div className="flex flex-col">
                  <TRDWSearchBar
                    placeholder={"Cari barang terdaftar disini..."}
                    value={searchText}
                    onChange={handleSearchTextInput}
                  />
                </div>
              </div>

              <div className="flex w-full h-full items-start">
                {filteredItems.length > 0 ? (
                  <div className="flex flex-col gap-2 w-full">
                    {/* TODO: Add Navigation to items */}
                    {filteredItems.map((element) => (
                      <ItemCard
                        key={element.id}
                        item={element}
                        onTap={() => {
                          console.log(`${element.id} is tapped`);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <TRDWEmptyView
                    label={"Tidak ada barang terdaftar untuk vendor.."}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
