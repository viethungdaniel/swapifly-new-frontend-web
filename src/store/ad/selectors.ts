import type { AppState } from "@/store";

export const selectBannersAds = (state: AppState) => state.ad.bannersAds;

export const selectRecommendedHomeProductsSquareAds = (state: AppState) =>
  state.ad.recommendedHomeProductsSquareAds;

export const selectPopupAd = (state: AppState) => state.ad.popupAd;

export const selectProductsSquareAds = (state: AppState) =>
  state.ad.productsSquareAds;

export const selectProductsRectangleAds = (state: AppState) =>
  state.ad.productsRectangleAds;

export const selectProductAd = (state: AppState) => state.ad.productAd;

export const selectInboxThreadsAds = (state: AppState) =>
  state.ad.inboxThreadsAds;
