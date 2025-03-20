"use client";

import { ItemCard } from "@/components/ui/item/ItemCard";
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { fetchAllItemsDataUseCase } from "@/usecase/items/fetch/FetchItemsDataUseCase";
import { filterItemUseCase } from "@/usecase/items/FilterItemsUseCase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ItemsPage = () => {
  const router = useRouter();
  const handleAddItemTappedEvent = () => {
    router.push(`/dashboard/items/add`);
  };

  const [searchText, setSearchText] = useState<string>("");
  const handleSearchTextInput = (value: string) => {
    setSearchText(value);
  };

  useEffect(() => {
    if (searchText.length <= 0) {
      setFilteredItems(items);
      return;
    }

    const filtered = filterItemUseCase(searchText, items);
    setFilteredItems(filtered);
  }, [searchText]);

  const [message, setMessage] = useState<string | null>();
  const [items, setItems] = useState<ItemEntity[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemEntity[]>([]);

  // Fetch Items Data
  useEffect(() => {
    const fetchData = async () => {
      setMessage("Mengambil data...");
      try {
        const itemsData = await fetchAllItemsDataUseCase();
        setItems(itemsData);
        setFilteredItems(itemsData);
      } catch (error: any) {
        setMessage(error.message);
      } finally {
        setMessage(null);
      }
    };

    fetchData();
  }, []);

  const handleItemCardTappedEvent = (id: number) => {};

  if (message) return <TRDWLoadingView label={message} />;

  return (
    <div className="flex flex-col justify-items-start w-full h-full gap-8">
      {/* Top Title */}
      <div className="flex flex-row items-start justify-between w-full">
        <h1 className="text-black text-2xl font-bold">Barang</h1>
        <TRDWButton
          variant={ButtonVariant.SECONDARY}
          iconName="ic:baseline-plus"
          onClick={handleAddItemTappedEvent}
        >
          Tambah Barang
        </TRDWButton>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full h-full items-start justify-items-start gap-6">
        <TRDWSearchBar
          placeholder={"Cari barang disini..."}
          value={searchText}
          onChange={handleSearchTextInput}
        />

        {/* Data Items */}
        <div className="flex flex-col w-full h-full overflow-x-scroll">
          <div className="flex flex-col gap-8">
            <ItemsListView
              items={filteredItems}
              onTap={() => handleAddItemTappedEvent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemsListView = ({
  items,
  onTap,
}: {
  items: ItemEntity[];
  onTap: (id: number) => void;
}) => {
  if (!items || items.length <= 0)
    return <TRDWEmptyView label={"Tidak ada data barang ditemukan..."} />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <ItemCard
            key={item.id ?? uuidv4()}
            item={item}
            onTap={() => onTap(item.id || -1)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
