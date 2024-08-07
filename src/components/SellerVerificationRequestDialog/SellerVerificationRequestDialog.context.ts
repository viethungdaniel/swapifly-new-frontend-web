import { createContext } from "react";

export type SellerVerificationRequestDialogContextValue = {
  open?: boolean;
  onClose?: Function;
};

const SellerVerificationRequestDialogContext =
  createContext<SellerVerificationRequestDialogContextValue>(null!);

export default SellerVerificationRequestDialogContext;
