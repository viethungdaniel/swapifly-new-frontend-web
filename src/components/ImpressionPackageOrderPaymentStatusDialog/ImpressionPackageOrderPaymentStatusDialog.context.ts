import { createContext } from "react";

import type { FetchProductResponseData } from "@/utils/apis/product";

export type ImpressionPackageOrderPaymentStatusDialogContextValue = {
  product: FetchProductResponseData | null;
  productLoading: boolean;
  productError: string;

  paymentError: string;

  isAppCallback: boolean;

  closeImpressionPackageOrderPaymentStatusDialog: () => void;
};

const ImpressionPackageOrderPaymentStatusDialogContext =
  createContext<ImpressionPackageOrderPaymentStatusDialogContextValue>(null!);

export default ImpressionPackageOrderPaymentStatusDialogContext;
