import { createContext } from "react";

import type { SignInAndSignUpDialogOpenPayload } from "./SignInAndSignUpDialog";
export interface SignInAndSignUpDialogContextValue {
  signInAndSignUpDialogOpen: boolean;
  signInAndSignUpDialogOpenPayload: SignInAndSignUpDialogOpenPayload;

  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;

  closeSignInAndSignUpDialogOnAuth: () => void;
  handleSignInAndSignUpDialogClose: (event?: React.SyntheticEvent) => void;
  handleViewSignInPush: (event?: React.SyntheticEvent) => void;
  handleViewSignUpPush: (event?: React.SyntheticEvent) => void;
  handleViewTermsOfServicePush: (event?: React.SyntheticEvent) => void;
  handleViewPrivacyPolicyPush: (event?: React.SyntheticEvent) => void;
  handleViewResetPasswordPush: (event?: React.SyntheticEvent) => void;
  handleViewSelectPreferencesPush: (event?: React.SyntheticEvent) => void;
}

const SignInAndSignUpDialogContext =
  createContext<SignInAndSignUpDialogContextValue>(undefined!);

export default SignInAndSignUpDialogContext;
