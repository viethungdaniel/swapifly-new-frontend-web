import { createContext } from "react";

import type { EmailVerificationFormDialogProps } from "./EmailVerificationFormDialog";

export type EmailVerificationFormDialogContextValue = {
  open?: boolean;
  onClose?: EmailVerificationFormDialogProps["onClose"];
};

const EmailVerificationFormDialogContext =
  createContext<EmailVerificationFormDialogContextValue>(null!);

export default EmailVerificationFormDialogContext;
