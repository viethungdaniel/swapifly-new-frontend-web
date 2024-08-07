import { createContext } from "react";

import type { PortalProps, VariantState } from "@/layouts/Portal/Portal";

export interface PortalContextValue {
  variant: PortalProps["variant"];
  variantState: VariantState;
}

const PortalContext = createContext<PortalContextValue>(undefined!);

export default PortalContext;
