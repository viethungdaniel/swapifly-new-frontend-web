import { createContext } from "react";

import type { FilterValue } from "./ProductFilterBar";

export interface ProductFilterBarContextValue {
  filtering: boolean;
  filterValue: FilterValue;
  requiredProductCategory: boolean;
  disabledProductSort: boolean;
  setFilterValue: (newFilterValue: FilterValue) => void;
  setFilterFieldValue: (field: keyof FilterValue, value: any) => void;
}

const ProductFilterBarContext = createContext<ProductFilterBarContextValue>(
  undefined!
);

export default ProductFilterBarContext;
