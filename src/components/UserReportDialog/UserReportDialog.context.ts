import { createContext } from "react";

export type ProductReportDialogContextValue = {
  open?: boolean;
  onClose?: Function;
};

const ProductReportDialogContext =
  createContext<ProductReportDialogContextValue>(null!);

export default ProductReportDialogContext;
