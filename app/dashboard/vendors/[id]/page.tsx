"use client";

import { ItemCard } from "@/components/ui/item/ItemCard";
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import { OverlayConfirmation } from "@/components/ui/shared/confirmation/OverlayConfirmation";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { TRDWLabel } from "@/components/ui/shared/label/TRDWLabel";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import { useOverlay } from "@/context/OverlayContext";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { VendorEntity } from "@/models/entity/VendorEntity";
import { fetchItemsByVendorIdUseCase } from "@/usecase/items/fetch/FetchItemsByVendorIdUseCase";
import { filterItemUseCase } from "@/usecase/items/FilterItemsUseCase";
import { fetchVendorByIdUseCase } from "@/usecase/vendors/fetch/FetchVendorByIDUseCase";
import { errorWriter } from "@/utils/errorWriter";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

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
    openOverlay({
      overlayContent: (
        <OverlayConfirmation
          title={"Konfirmasi Hapus"}
          description={"Apakah anda yakin untuk menghapus vendor ini?"}
          onConfirm={deleteVendor}
          onCancel={closeOverlay}
        />
      ),
      isFullScreen: false,
    });
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
      } catch (error) {
        setMessage(errorWriter(error));
      } finally {
        setMessage(null);
      }
    };

    fetchVendorData();
  }, [params.id]);

  const filteredItems = useMemo(() => {
    if (searchText.length <= 0) return items;
    return filterItemUseCase(searchText, items);
  }, [searchText, items]);

  const handleItemCardTappedEvent = (id: number) => {
    router.push(`/dashboard/items/${id}`);
  };

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

              <VendorItemListView
                items={filteredItems}
                onClick={handleItemCardTappedEvent}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const VendorItemListView = ({
  items,
  onClick,
}: {
  items: ItemEntity[];
  onClick: (id: number) => void;
}) => {
  if (items.length <= 0)
    return (
      <TRDWEmptyView label={"Tidak ada barang terdaftar untuk vendor.."} />
    );

  return (
    <ListViewContainer>
      {items.map((element) => (
        <ItemCard
          key={element.id}
          item={element}
          onTap={() => {
            if (element.id) onClick(element.id);
          }}
        />
      ))}
    </ListViewContainer>
  );
};
