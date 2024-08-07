import { createContext } from "react";

import { FetchProductReportResponseData } from "@/utils/apis/productReport";

export type ProductItemReportDialogContextValue = {
  disabledPurchaseVisits?: boolean;
  productReport: FetchProductReportResponseData | null;
  productReportLoading: boolean;
  productReportError: string;
  open?: boolean;
  onClose?: Function;
};

const ProductItemReportDialogContext =
  createContext<ProductItemReportDialogContextValue>(null!);

export default ProductItemReportDialogContext;
