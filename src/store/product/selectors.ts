import { adHelpers } from "@/utils/helpers";
import {
  selectProductsRectangleAds,
  selectProductsSquareAds,
  selectRecommendedHomeProductsSquareAds,
} from "@/store/ad/selectors";
import { createSelector } from "@reduxjs/toolkit";

import type { AppState } from "@/store";

export const selectBookmarkedProducts = (state: AppState) =>
  state.product.bookmarkedProducts;

export const selectRecommendedHomeProducts = (state: AppState) =>
  state.product.recommendedHomeProducts;

export const selectRecommendedProducts = (state: AppState) =>
  state.product.recommendedProducts;

export const selectSimilarProducts = (state: AppState) =>
  state.product.similarProducts;

export const selectUserProducts = (state: AppState) =>
  state.product.userProducts;

export const selectProducts = (state: AppState) => state.product.products;

export const selectCurrentBookmarkedProducts = createSelector(
  [selectBookmarkedProducts],
  (bookmarkedProducts) =>
    bookmarkedProducts.filter(
      (bookmarkedProduct) => !!bookmarkedProduct.bookmark
    )
);

export const selectCurrentBookmarkedProductsLength = createSelector(
  [selectCurrentBookmarkedProducts],
  (curBookmarkedProducts) => curBookmarkedProducts.length
);

export const selectProductCategoryIdToHomeProductsMap = (state: AppState) =>
  state.product.productCategoryIdToHomeProductsMap;
export const selectProductCategoryId = (
  _: AppState,
  productCategoryId: number
) => productCategoryId;

export const selectAdWithProductCategoryHomeProducts = createSelector(
  [
    selectProductCategoryIdToHomeProductsMap,
    selectProductCategoryId,
    selectProductsSquareAds,
    selectProductsRectangleAds,
  ],
  (
    productCategoryIdToHomeProductsMap,
    productCategoryId,
    productsSquareAds,
    productsRectangleAds
  ) => {
    const products =
      productCategoryIdToHomeProductsMap[productCategoryId] ?? [];

    const adWithProductCategoryHomeProducts: {
      productsSquareAd: (typeof productsSquareAds)[number] | null;
      productsRectangleAd: (typeof productsRectangleAds)[number] | null;
      product: (typeof products)[number] | null;
    }[] = products.map((product) => {
      return {
        productsRectangleAd: null,
        productsSquareAd: null,
        product,
      };
    });

    if (adWithProductCategoryHomeProducts.length > 0)
      [...productsRectangleAds, ...productsSquareAds]
        .sort(
          (prevAd, nextAd) =>
            (prevAd.ep_rectangle ?? 1) - (nextAd.ep_rectangle ?? 1)
        )
        .forEach((ad) => {
          const productsRectangleAdIndex = ad?.ep_rectangle
            ? ad?.ep_rectangle - 1
            : 0;
          adWithProductCategoryHomeProducts.splice(
            productsRectangleAdIndex,
            0,
            {
              productsRectangleAd: adHelpers.isAdProductsRectangleType(ad.type)
                ? ad
                : null,
              productsSquareAd: adHelpers.isAdProductsSquareType(ad.type)
                ? ad
                : null,
              product: null,
            }
          );
        });

    return adWithProductCategoryHomeProducts;
  }
);

export const selectAdWithRecommendedHomeProducts = createSelector(
  [selectRecommendedHomeProducts, selectRecommendedHomeProductsSquareAds],
  (recommendedHomeProducts, recommendedHomeProductsSquareAds) => {
    const adWithRecommendedHomeProducts: {
      recommendedHomeProductsSquareAd:
        | (typeof recommendedHomeProductsSquareAds)[number]
        | null;
      recommendedHomeProduct: (typeof recommendedHomeProducts)[number] | null;
    }[] = recommendedHomeProducts.map((recommendedHomeProduct) => {
      return {
        recommendedHomeProductsSquareAd: null,
        recommendedHomeProduct,
      };
    });

    if (adWithRecommendedHomeProducts.length > 0)
      recommendedHomeProductsSquareAds.forEach(
        (recommendedHomeProductsSquareAd) => {
          const recommendedHomeProductsSquareAdIndex =
            recommendedHomeProductsSquareAd?.ep_rectangle
              ? recommendedHomeProductsSquareAd?.ep_rectangle - 1
              : 0;
          adWithRecommendedHomeProducts.splice(
            recommendedHomeProductsSquareAdIndex,
            0,
            {
              recommendedHomeProductsSquareAd,
              recommendedHomeProduct: null,
            }
          );
        }
      );
    return adWithRecommendedHomeProducts;
  }
);

export const selectAdWithRecommendedProducts = createSelector(
  [
    selectRecommendedProducts,
    selectProductsSquareAds,
    selectProductsRectangleAds,
  ],
  (recommendedProducts, productsSquareAds, productsRectangleAds) => {
    const adWithRecommendedProducts: {
      productsSquareAd: (typeof productsSquareAds)[number] | null;
      productsRectangleAd: (typeof productsRectangleAds)[number] | null;
      recommendedProduct: (typeof recommendedProducts)[number] | null;
    }[] = recommendedProducts.map((recommendedProduct) => {
      return {
        productsSquareAd: null,
        productsRectangleAd: null,
        recommendedProduct,
      };
    });

    if (adWithRecommendedProducts.length > 0)
      [...productsRectangleAds, ...productsSquareAds]
        .sort(
          (prevAd, nextAd) =>
            (prevAd.ep_rectangle ?? 1) - (nextAd.ep_rectangle ?? 1)
        )
        .forEach((ad) => {
          const productsRectangleAdIndex = ad?.ep_rectangle
            ? ad?.ep_rectangle - 1
            : 0;
          adWithRecommendedProducts.splice(productsRectangleAdIndex, 0, {
            productsRectangleAd: adHelpers.isAdProductsRectangleType(ad.type)
              ? ad
              : null,
            productsSquareAd: adHelpers.isAdProductsSquareType(ad.type)
              ? ad
              : null,
            recommendedProduct: null,
          });
        });
    return adWithRecommendedProducts;
  }
);

export const selectAdWithProducts = createSelector(
  [selectProducts, selectProductsSquareAds, selectProductsRectangleAds],
  (products, productsSquareAds, productsRectangleAds) => {
    const adWithProducts: {
      productsSquareAd: (typeof productsSquareAds)[number] | null;
      productsRectangleAd: (typeof productsRectangleAds)[number] | null;
      product: (typeof products)[number] | null;
    }[] = products.map((product) => {
      return {
        productsSquareAd: null,
        productsRectangleAd: null,
        product,
      };
    });

    if (adWithProducts.length > 0)
      [...productsRectangleAds, ...productsSquareAds]
        .sort(
          (prevAd, nextAd) =>
            (prevAd.ep_rectangle ?? 1) - (nextAd.ep_rectangle ?? 1)
        )
        .forEach((ad) => {
          const productsRectangleAdIndex = ad?.ep_rectangle
            ? ad?.ep_rectangle - 1
            : 0;
          adWithProducts.splice(productsRectangleAdIndex, 0, {
            productsRectangleAd: adHelpers.isAdProductsRectangleType(ad.type)
              ? ad
              : null,
            productsSquareAd: adHelpers.isAdProductsSquareType(ad.type)
              ? ad
              : null,
            product: null,
          });
        });
    return adWithProducts;
  }
);

export const selectAdWithBookmarkedProducts = createSelector(
  [
    selectBookmarkedProducts,
    selectProductsSquareAds,
    selectProductsRectangleAds,
  ],
  (bookmarkedProducts, productsSquareAds, productsRectangleAds) => {
    const adWithBookmarkedProducts: {
      productsSquareAd: (typeof productsSquareAds)[number] | null;
      productsRectangleAd: (typeof productsRectangleAds)[number] | null;
      bookmarkedProduct: (typeof bookmarkedProducts)[number] | null;
    }[] = bookmarkedProducts.map((bookmarkedProduct) => {
      return {
        productsSquareAd: null,
        productsRectangleAd: null,
        bookmarkedProduct,
      };
    });

    if (adWithBookmarkedProducts.length > 0)
      [...productsRectangleAds, ...productsSquareAds]
        .sort(
          (prevAd, nextAd) =>
            (prevAd.ep_rectangle ?? 1) - (nextAd.ep_rectangle ?? 1)
        )
        .forEach((ad) => {
          const productsRectangleAdIndex = ad?.ep_rectangle
            ? ad?.ep_rectangle - 1
            : 0;
          adWithBookmarkedProducts.splice(productsRectangleAdIndex, 0, {
            productsRectangleAd: adHelpers.isAdProductsRectangleType(ad.type)
              ? ad
              : null,
            productsSquareAd: adHelpers.isAdProductsSquareType(ad.type)
              ? ad
              : null,
            bookmarkedProduct: null,
          });
        });
    return adWithBookmarkedProducts;
  }
);

export const selectAdWithSimilarProducts = createSelector(
  [selectSimilarProducts, selectProductsSquareAds, selectProductsRectangleAds],
  (similarProducts, productsSquareAds, productsRectangleAds) => {
    const adWithSimilarProducts: {
      productsSquareAd: (typeof productsSquareAds)[number] | null;
      productsRectangleAd: (typeof productsRectangleAds)[number] | null;
      similarProduct: (typeof similarProducts)[number] | null;
    }[] = similarProducts.map((similarProduct) => {
      return {
        productsSquareAd: null,
        productsRectangleAd: null,
        similarProduct,
      };
    });

    if (adWithSimilarProducts.length > 0)
      [...productsRectangleAds, ...productsSquareAds]
        .sort(
          (prevAd, nextAd) =>
            (prevAd.ep_rectangle ?? 1) - (nextAd.ep_rectangle ?? 1)
        )
        .forEach((ad) => {
          const productsRectangleAdIndex = ad?.ep_rectangle
            ? ad?.ep_rectangle - 1
            : 0;
          adWithSimilarProducts.splice(productsRectangleAdIndex, 0, {
            productsRectangleAd: adHelpers.isAdProductsRectangleType(ad.type)
              ? ad
              : null,
            productsSquareAd: adHelpers.isAdProductsSquareType(ad.type)
              ? ad
              : null,
            similarProduct: null,
          });
        });
    return adWithSimilarProducts;
  }
);

export const selectAdWithUserProducts = createSelector(
  [selectUserProducts, selectProductsSquareAds, selectProductsRectangleAds],
  (userProducts, productsSquareAds, productsRectangleAds) => {
    const adWithUserProducts: {
      productsSquareAd: (typeof productsSquareAds)[number] | null;
      productsRectangleAd: (typeof productsRectangleAds)[number] | null;
      userProduct: (typeof userProducts)[number] | null;
    }[] = userProducts.map((userProduct) => {
      return {
        productsSquareAd: null,
        productsRectangleAd: null,
        userProduct,
      };
    });

    if (adWithUserProducts.length > 0)
      [...productsRectangleAds, ...productsSquareAds]
        .sort(
          (prevAd, nextAd) =>
            (prevAd.ep_rectangle ?? 1) - (nextAd.ep_rectangle ?? 1)
        )
        .forEach((ad) => {
          const productsRectangleAdIndex = ad?.ep_rectangle
            ? ad?.ep_rectangle - 1
            : 0;
          adWithUserProducts.splice(productsRectangleAdIndex, 0, {
            productsRectangleAd: adHelpers.isAdProductsRectangleType(ad.type)
              ? ad
              : null,
            productsSquareAd: adHelpers.isAdProductsSquareType(ad.type)
              ? ad
              : null,
            userProduct: null,
          });
        });
    return adWithUserProducts;
  }
);
