import { useCallback, useEffect, useState } from "react";
import { OverlayContentContainer } from "../shared/overlay/OverlayContentContainer";
import { OverlayContentTitle } from "../shared/overlay/OverlayContentTitle";
import TRDWSearchBar from "../shared/searchbar/TRDWSearchBar";
import { ItemEntity } from "@/models/entity/ItemEntity";
import TRDWEmptyView from "../shared/empty/TRDWEmptyView";
import { ListViewContainer } from "../shared/listViewContainer/ListViewContainer";
import { TransactionItemCardEntity } from "@/models/entity/TransactionItemCartEntity";
import { TransactionItemSelectionCard } from "./TransactionItemSelectionCard";
import { toast } from "react-toastify";
import { errorWriter } from "@/utils/errorWriter";
import { fetchAllItemsDataUseCase } from "@/usecase/items/fetch/FetchItemsDataUseCase";
import { TRDWLoadingView } from "../shared/loading/TRDWLoadingView";
import { filterItemUseCase } from "@/usecase/items/FilterItemsUseCase";
import { filterItemNotInCartUseCase } from "@/usecase/transaction/FilterItemNotInCartUseCase";

export const TransactionItemSelectionView = ({
  carts,
  onSelect,
  onCancel,
}: {
  carts: TransactionItemCardEntity[];
  onSelect: (item: ItemEntity) => void;
  onCancel: () => void;
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [message, setMessage] = useState<string>();
  const [itemList, setItemList] = useState<ItemEntity[]>([]);
  const [filteredItemList, setFilteredItemList] = useState<ItemEntity[]>([]);

  const fetchItemEntity = useCallback(async () => {
    try {
      setMessage("Sedang mengambil data barang...");
      const fetchedItems = await fetchAllItemsDataUseCase();
      const filteredItemsNotInCart = filterItemNotInCartUseCase(
        fetchedItems,
        carts
      );
      setItemList(filteredItemsNotInCart);
      setFilteredItemList(filteredItemsNotInCart);
    } catch (error) {
      toast.error(errorWriter(error));
    } finally {
      setMessage(undefined);
    }
  }, [carts]);

  const handleSearchTextInput = (query: string) => {
    setSearchText(query);
    const filteredItems = filterItemUseCase(query, itemList);
    const filteredItemsNotInCart = filterItemNotInCartUseCase(
      filteredItems,
      carts
    );

    setFilteredItemList(filteredItemsNotInCart);
  };

  useEffect(() => {
    fetchItemEntity();
  }, [fetchItemEntity]);

  return (
    <OverlayContentContainer>
      <OverlayContentTitle title={"Pilih Barang"} onCancel={onCancel} />
      <TRDWSearchBar
        placeholder={"Masukkan barang yang ingin dicari disini..."}
        value={searchText}
        onChange={(query) => {
          handleSearchTextInput(query);
        }}
      />

      <div className="flex w-full h-full">
        <ItemListView
          itemList={filteredItemList}
          onSelect={onSelect}
          carts={carts}
          message={message}
        />
      </div>
    </OverlayContentContainer>
  );
};

const ItemListView = ({
  message,
  itemList,
  onSelect,
}: {
  message?: string;
  carts: TransactionItemCardEntity[];
  itemList: ItemEntity[];
  onSelect: (item: ItemEntity) => void;
}) => {
  if (message) return <TRDWLoadingView label={message} />;
  if (itemList.length <= 0)
    return <TRDWEmptyView label={"Tidak ada data barang..."} />;

  return (
    <div className="w-full max-h-[40vh]">
      <ListViewContainer>
        {itemList.map((item) => (
          <TransactionItemSelectionCard
            key={item.itemId}
            itemEntity={item}
            onSelect={onSelect}
          />
        ))}
      </ListViewContainer>
    </div>
  );
};
