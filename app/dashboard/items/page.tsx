"use client";

import { ItemCard } from "@/components/ui/item/ItemCard";
import TRDWButton, {
  ButtonVariant,
} from "@/components/ui/shared/button/TRDWButton";
import TRDWEmptyView from "@/components/ui/shared/empty/TRDWEmptyView";
import { ListViewContainer } from "@/components/ui/shared/listViewContainer/ListViewContainer";
import { TRDWLoadingView } from "@/components/ui/shared/loading/TRDWLoadingView";
import TRDWSearchBar from "@/components/ui/shared/searchbar/TRDWSearchBar";
import { ItemEntity } from "@/models/entity/ItemEntity";
import { fetchAllItemsDataUseCase } from "@/usecase/items/fetch/FetchItemsDataUseCase";
import { filterItemUseCase } from "@/usecase/items/FilterItemsUseCase";
import { errorWriter } from "@/utils/errorWriter";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ItemsPage = () => {
  const router = useRouter();
  const handleAddItemTappedEvent = () => {
    router.push(`/dashboard/items/add`);
  };

  const [message, setMessage] = useState<string | null>();
  const [items, setItems] = useState<ItemEntity[]>([]);

  const [searchText, setSearchText] = useState<string>("");
  const handleSearchTextInput = (value: string) => {
    setSearchText(value);
  };

  const filteredItems = useMemo(() => {
    if (searchText.length <= 0) return items;
    return filterItemUseCase(searchText, items);
  }, [searchText, items]);

  // Fetch Items Data
  useEffect(() => {
    const fetchData = async () => {
      setMessage("Mengambil data...");
      try {
        const itemsData = await fetchAllItemsDataUseCase();
        setItems(itemsData);
      } catch (error) {
        setMessage(errorWriter(error));
      } finally {
        setMessage(null);
      }
    };

    fetchData();
  }, []);

  const handleItemCardTappedEvent = (id: number) => {
    router.push(`/dashboard/items/${id}`);
  };

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
        <ItemsListView
          items={filteredItems}
          onTap={(id) => {
            handleItemCardTappedEvent(id);
          }}
        />
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
    <ListViewContainer>
      {items.map((item) => (
        <ItemCard
          key={item.itemId}
          item={item}
          onTap={() => {
            if (item.id) {
              onTap(item.id);
            }
          }}
        />
      ))}
    </ListViewContainer>
  );
};

export default ItemsPage;
