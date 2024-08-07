import { createContext } from "react";

import type { ConfirmationResult } from "firebase/auth";

export type ViewResetPasswordContextValue = {
  setFirebaseAuthConfirmationResult: React.Dispatch<{
    [phone: string]: ConfirmationResult;
  }>;
};

const ViewResetPasswordContext = createContext<ViewResetPasswordContextValue>(
  null!
);

export default ViewResetPasswordContext;
