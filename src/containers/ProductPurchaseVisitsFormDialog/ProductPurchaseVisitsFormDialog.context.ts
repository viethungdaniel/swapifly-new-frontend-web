import { createContext } from "react";

import type { FetchProductResponseData } from "@/utils/apis/product";

import { FetchImpressionPackagesResponseData } from "@/utils/apis/impressionPackage";

export type ProductPurchaseVisitsFormDialogContextValue = {
  product: FetchProductResponseData | null;
  productLoading: boolean;
  productError: string;

  impressionPackages: FetchImpressionPackagesResponseData;
  impressionPackagesLoading: boolean;
  impressionPackagesError: string;

  open?: boolean;
  onClose?: () => void;
};

const ProductPurchaseVisitsFormDialogContext =
  createContext<ProductPurchaseVisitsFormDialogContextValue>(null!);

export default ProductPurchaseVisitsFormDialogContext;
