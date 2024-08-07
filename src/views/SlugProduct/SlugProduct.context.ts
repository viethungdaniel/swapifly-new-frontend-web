import { createContext } from "react";

export interface SlugProductContextValue {
  productDeleted: boolean;
  productId: number;
  productItemReportDialogOpen: boolean;
  productPurchaseVisitsFormDialogOpen: boolean;
  createProductInboxThreadOffer: (payload: { price: number }) => void;
  navigateInboxThread: () => void;
  deleteProduct: () => void;
  markSoldProduct: () => void;
  openProductItemReportDialog: () => void;
  closeProductItemReportDialog: () => void;
  openProductPurchaseVisitsFormDialog: () => void;
  closeProductPurchaseVisitsFormDialog: () => void;
}

const SlugProductContext = createContext<SlugProductContextValue>(null!);

export default SlugProductContext;
