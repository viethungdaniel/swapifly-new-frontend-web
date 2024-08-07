import { createSelector } from "@reduxjs/toolkit";

import { selectBannersAds } from "@/store/ad/selectors";

import type { AppState } from "@/store";

export const selectBanners = (state: AppState) => state.banner.banners;

export const selectAdWithBanners = createSelector(
  [selectBanners, selectBannersAds],
  (banners, bannersAds) => {
    const adWithBanners: {
      bannersAd: (typeof bannersAds)[number] | null;
      banner: (typeof banners)[number] | null;
    }[] = banners.map((banner) => {
      return {
        bannersAd: null,
        banner,
      };
    });

    bannersAds.forEach((bannersAd) => {
      const bannersAdIndex = bannersAd?.ep_rectangle
        ? bannersAd?.ep_rectangle - 1
        : 0;
      adWithBanners.splice(bannersAdIndex, 0, {
        bannersAd,
        banner: null,
      });
    });
    return adWithBanners;
  }
);
