import { createContext } from "react";

import type { VirtualizationListboxComponentProps } from "./VirtualizationListboxComponent";

export type VirtualizationListboxComponentContextValue = {
  items: [any, React.ReactNode];
  virtualizationListboxComponentProps: VirtualizationListboxComponentProps;
  changeSize: (index: number, itemSize: number) => void;
};

const VirtualizationListboxComponentContext =
  createContext<VirtualizationListboxComponentContextValue>(null!);

export default VirtualizationListboxComponentContext;
