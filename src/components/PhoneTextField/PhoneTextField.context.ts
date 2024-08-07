import { createContext } from "react";

export interface PhoneTextFieldContextValue {
  countryCode?: string;
  countryCodeSelectPopperAnchor: HTMLDivElement | null;
  countryCodeSelectPopperOpen: boolean;
  setCountryCodeSelectPopperOpen: React.Dispatch<boolean>;
  changeCountryCode: (newCountryCode: string) => void;
}

const PhoneTextFieldContext = createContext<PhoneTextFieldContextValue>(null!);

export default PhoneTextFieldContext;
