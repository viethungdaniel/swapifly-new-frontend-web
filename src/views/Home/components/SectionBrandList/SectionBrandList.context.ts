import { createContext } from "react";

import type { FetchBrandsPayload } from "@/utils/apis/brand";

export interface SectionBrandListContextValue {
  brandsLimit: number;

  brandsPage: number;
  setBrandsPage: React.Dispatch<React.SetStateAction<number>>;

  fetchBrands: (
    payload?: {
      params?: FetchBrandsPayload["params"];
    },
    meta?: {
      isLoadMore?: boolean;
      isReset?: boolean;
    }
  ) => void;
}

const SectionBrandListContext = createContext<SectionBrandListContextValue>(
  undefined!
);

export default SectionBrandListContext;
