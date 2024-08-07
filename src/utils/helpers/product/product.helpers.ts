import { productConstants } from "@/utils/constants";

export const isSoldProduct = (productState?: number) => {
  return productState === productConstants.SOLD_STATE_NUMBER;
};
