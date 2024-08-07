import { createContext } from "react";

import type { PhoneVerificationFormDialogProps } from "./PhoneVerificationFormDialog";
import type { ConfirmationResult } from "firebase/auth";

export type PhoneVerificationFormDialogContextValue = {
  open?: boolean;
  setFirebaseAuthConfirmationResult: React.Dispatch<{
    [phone: string]: ConfirmationResult;
  }>;
  onClose?: PhoneVerificationFormDialogProps["onClose"];
};

const PhoneVerificationFormDialogContext =
  createContext<PhoneVerificationFormDialogContextValue>(null!);

export default PhoneVerificationFormDialogContext;
