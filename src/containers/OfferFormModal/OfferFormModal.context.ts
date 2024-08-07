import { createContext } from "react";

import type { OfferFormModalProps } from "./OfferFormModal";

export type OfferFormModalContextValue = Pick<
  OfferFormModalProps,
  "currency" | "variant" | "open" | "onClose"
>;

const OfferFormModalContext = createContext<OfferFormModalContextValue>(null!);

export default OfferFormModalContext;
