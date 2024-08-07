import { createContext } from "react";

import type { AutocompleteListboxVirtualizationProps } from "./AutocompleteListboxVirtualization";

export type AutocompleteListboxVirtualizationContextValue = {
  items: [any, React.ReactNode];
  autocompleteListboxVirtualizationProps: AutocompleteListboxVirtualizationProps;
  changeSize: (index: number, itemSize: number) => void;
};

const AutocompleteListboxVirtualizationContext =
  createContext<AutocompleteListboxVirtualizationContextValue>(null!);

export default AutocompleteListboxVirtualizationContext;
