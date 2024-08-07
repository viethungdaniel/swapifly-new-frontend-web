import { createSelector } from "@reduxjs/toolkit";

import { regionConstants } from "@/utils/constants";

import type { AppState } from "@/store";

export const selectRegions = (state: AppState) => state.common.regions;

export const selectDefaultRegion = createSelector(
  [selectRegions],
  (regions) => {
    return (
      regions.find(
        (region) => region.id === regionConstants.DEFAULT_REGION_ID
      ) || null
    );
  }
);
