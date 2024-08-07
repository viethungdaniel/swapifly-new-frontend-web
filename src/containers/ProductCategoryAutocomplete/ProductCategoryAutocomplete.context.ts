import { createContext } from "react";

import type { ProductCategoriesTrees } from "@/store/productCategory/types";
import type { AutocompleteChangeReason } from "@mui/material";
import type { AppAutocompleteProps } from "@/components/AppAutocomplete";

export interface ProductCategorySelectContextValue {
  hasInputValue?: boolean;
  disableCloseOnSelect?: boolean;
  name?: string;
  disableClearable?: boolean;
  selectOnlyLastOption?: boolean;
  selectedProductCategoryTree:
    | ProductCategoriesTrees
    | ProductCategoriesTrees[number]
    | null;
  productCategoriesTrees: ProductCategoriesTrees;
  onChange?: (
    event: React.SyntheticEvent,
    newValue: ProductCategoriesTrees | ProductCategoriesTrees[number] | null,
    reason: AutocompleteChangeReason
  ) => void;
  onClose?: AppAutocompleteProps<any>["onClose"];
}

const ProductCategorySelectContext =
  createContext<ProductCategorySelectContextValue>(undefined!);

export default ProductCategorySelectContext;
