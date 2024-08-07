import { createContext } from "react";

import type { ProductCategories } from "@/store/productCategory/types";

type OptionMenu = {
  key: string;
  isHistory?: boolean;
  variant: "userSearch" | "productSearch";
  label: string;
  value: any | null;
  search: string;
};

export interface MainSearchContextValue {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  submittedSearch: string;
  setSubmittedSearch: React.Dispatch<React.SetStateAction<string>>;

  histories: OptionMenu[];

  optionMenus: OptionMenu[];
  fetchOptionMenus: (payload?: { search?: string }) => void;

  handleHistoryRemove: (key: string) => (event: React.SyntheticEvent) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleHistoryClear: (event?: React.SyntheticEvent) => void;
  handleProductCategoryChange: (
    productCategory?: Partial<ProductCategories[number]> | null
  ) => void;
  submitSearch: (optionMenu?: OptionMenu) => void;
}

const MainSearchContext = createContext<MainSearchContextValue>(undefined!);

export default MainSearchContext;
