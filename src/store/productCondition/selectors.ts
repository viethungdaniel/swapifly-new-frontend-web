import { createSelector } from "@reduxjs/toolkit";

import type { AppState } from "@/store";

export const selectProductConditions = (state: AppState) =>
  state.productCondition.productConditions;

export const selectIdToProductConditionsMap = createSelector(
  selectProductConditions,
  (productConditions) => {
    return productConditions.reduce(
      (idToProductConditionMap, productCondition) => {
        Object.assign(idToProductConditionMap, {
          [productCondition.id]: productCondition,
        });
        return idToProductConditionMap;
      },
      {} as {
        [
          key: number
        ]: AppState["productCondition"]["productConditions"][number];
      }
    );
  }
);
