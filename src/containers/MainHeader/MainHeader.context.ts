import { createContext } from "react";

export interface MainHeaderContextValue {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  selectedProductCategoryId: number | null;
  setSelectedProductCategoryId: React.Dispatch<
    React.SetStateAction<number | null>
  >;
}

const MainHeaderContext = createContext<MainHeaderContextValue>(undefined!);

export default MainHeaderContext;
