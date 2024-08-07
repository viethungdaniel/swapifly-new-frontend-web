import { ProductActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import { HYDRATE } from "next-redux-wrapper";

import type { ProductState, ProductAction } from "./types";

export const initialState: ProductState = {
  products: [],
  productsError: "",
  productsLoading: true,
  productsCount: 0,

  draftProduct: null,
  draftProductError: "",
  draftProductLoading: true,

  draftProducts: [],
  draftProductsError: "",
  draftProductsLoading: true,

  userProducts: [],
  userProductsCount: 0,
  userProductsError: "",
  userProductsLoading: true,

  bookmarkedProducts: [],
  bookmarkedProductsError: "",
  bookmarkedProductsLoading: true,
  bookmarkedProductsCount: 0,
  currentBookmarkedProductsCount: 0,

  similarProducts: [],
  similarProductsError: "",
  similarProductsLoading: true,
  similarProductsCount: 0,

  recommendedProducts: [],
  recommendedProductsError: "",
  recommendedProductsLoading: true,
  recommendedProductsCount: 0,

  recommendedHomeProducts: [],
  recommendedHomeProductsError: "",
  recommendedHomeProductsLoading: true,
  recommendedHomeProductsCount: 0,

  productCategoryIdToHomeProductsErrorMap: {},
  productCategoryIdToHomeProductsLoadingMap: {},
  productCategoryIdToHomeProductsMap: {},

  product: null,
  productError: "",
  productLoading: true,
};

const reducer = (state = initialState, action: ProductAction): ProductState => {
  switch (action.type) {
    case HYDRATE as any: {
      const {
        draftProduct,
        draftProductError,
        draftProductLoading,
        product,
        productError,
        productLoading,
        hydrated,
      } = (action as any).payload.product as ProductState;

      const newState = {
        draftProduct,
        draftProductError,
        draftProductLoading,
        product,
        productError,
        productLoading,
      };

      if (typeof hydrated !== "undefined") {
        Object.entries(newState).forEach(([key, _state]) => {
          if (typeof _state === "undefined") delete (newState as any)[key];
        });
      }

      return {
        ...state,
        ...(typeof hydrated !== "undefined" ? newState : {}),
        hydrated: true,
      };
    }

    case ProductActionTypes.FETCH_REQUESTED: {
      const { scope, isReset } = action.payload;

      const newState = {
        ...state,
        ...(typeof state[`${scope}Loading` as keyof typeof state] !==
        "undefined"
          ? {
              [`${scope}Loading`]: true,
            }
          : {}),
        ...(typeof state[`${scope}Error` as keyof typeof state] !== "undefined"
          ? {
              [`${scope}Error`]: "",
            }
          : {}),
      };

      if (isReset) {
        Object.assign(newState, {
          [scope]: Array.isArray(newState[scope]) ? [] : null,
        });
      }

      return newState;
    }
    case ProductActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count, isLoadMore } = action.payload;

      let newData = data;
      const stateData = state[scope];

      if (isLoadMore && Array.isArray(stateData) && Array.isArray(data)) {
        const filteredData = data.filter((item) => {
          return stateData.every(
            (stateDataItem) => item.id !== stateDataItem.id
          );
        });
        newData = [...stateData, ...filteredData] as typeof data;
      }

      return {
        ...state,
        [scope]: newData,
        ...(typeof state[`${scope}Loading` as keyof typeof state] !==
        "undefined"
          ? {
              [`${scope}Loading`]: false,
            }
          : {}),
        ...(commonHelpers.isNumber(count)
          ? {
              [`${scope}Count`]: count,
            }
          : {}),
      };
    }
    case ProductActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        ...(typeof state[`${scope}Loading` as keyof typeof state] !==
        "undefined"
          ? {
              [`${scope}Loading`]: false,
            }
          : {}),
        ...(typeof state[`${scope}Error` as keyof typeof state] !== "undefined"
          ? {
              [`${scope}Error`]: error,
            }
          : {}),
      };
    }

    case ProductActionTypes.MAP_FETCH_REQUESTED: {
      const { scope, key } = action.payload;
      const loadingMap = {
        ...state[`${scope}LoadingMap`],
        [key]: true,
      };
      const errorMap = {
        ...state[`${scope}ErrorMap`],
        [key]: "",
      };

      return {
        ...state,
        [`${scope}LoadingMap`]: loadingMap,
        [`${scope}ErrorMap`]: errorMap,
      };
    }
    case ProductActionTypes.MAP_FETCH_SUCCEEDED: {
      const { scope, key, data } = action.payload;

      const dataMap = {
        ...state[`${scope}Map`],
        [key]: data,
      };
      const loadingMap = {
        ...state[`${scope}LoadingMap`],
        [key]: false,
      };

      return {
        ...state,
        [`${scope}Map`]: dataMap,
        [`${scope}LoadingMap`]: loadingMap,
      };
    }
    case ProductActionTypes.MAP_FETCH_FAILED: {
      const { scope, key, error } = action.payload;
      const loadingMap = {
        ...state[`${scope}LoadingMap`],
        [key]: false,
      };
      const errorMap = {
        ...state[`${scope}LoadingMap`],
        [key]: error,
      };

      return {
        ...state,
        [`${scope}LoadingMap`]: loadingMap,
        [`${scope}ErrorMap`]: errorMap,
      };
    }

    case ProductActionTypes.FETCH_PRODUCT_SUCCEEDED_SERVER: {
      return {
        product: action.payload,
        productError: "",
        productLoading: false,
        hydrated: true,
      } as Partial<ProductState> as ProductState;
    }

    case ProductActionTypes.FETCH_DRAFT_PRODUCT_SUCCEEDED_SERVER: {
      return {
        draftProduct: action.payload,
        draftProductError: "",
        draftProductLoading: false,
        hydrated: true,
      } as Partial<ProductState> as ProductState;
    }

    case ProductActionTypes.SET_ALL_PRODUCT_BOOKMARKED: {
      const { id, bookmarked } = action.payload;

      const newProducts = state.products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            bookmark: bookmarked,
          };
        }
        return product;
      });

      const newUserProducts = state.userProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            bookmark: bookmarked,
          };
        }
        return product;
      });

      const newProduct =
        state.product && state.product.product?.id === id
          ? ({
              ...state.product,
              bookmark: bookmarked ? (1 as const) : (0 as const),
            } as typeof state.product)
          : state.product;

      const newBookmarkedProductsCount = bookmarked
        ? state.bookmarkedProductsCount + 1
        : state.bookmarkedProductsCount - 1 < 0
        ? 0
        : state.bookmarkedProductsCount - 1;
      const newCurrentBookmarkedProductsCount = bookmarked
        ? state.currentBookmarkedProductsCount + 1
        : state.currentBookmarkedProductsCount - 1 < 0
        ? 0
        : state.currentBookmarkedProductsCount - 1;

      const newBookmarkedProducts = state.bookmarkedProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            bookmark: bookmarked,
          };
        }
        return product;
      });

      const newRecommendedHomeProducts = state.recommendedHomeProducts.map(
        (product) => {
          if (product.id === id) {
            return {
              ...product,
              bookmark: bookmarked,
            };
          }
          return product;
        }
      );

      const newSimilarProducts = state.similarProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            bookmark: bookmarked,
          };
        }
        return product;
      });

      const newProductCategoryIdToHomeProductsMap = {
        ...state.productCategoryIdToHomeProductsMap,
      };
      const homeProductCategoryIds = Object.entries(
        newProductCategoryIdToHomeProductsMap
      ).map(
        ([index]) =>
          index as unknown as keyof typeof newProductCategoryIdToHomeProductsMap
      );
      homeProductCategoryIds.forEach((productCategoryId) => {
        const products =
          newProductCategoryIdToHomeProductsMap[productCategoryId];
        if (Array.isArray(products)) {
          newProductCategoryIdToHomeProductsMap[productCategoryId] =
            products.map((product) => {
              if (product.id === id) {
                return {
                  ...product,
                  bookmark: bookmarked,
                };
              }
              return product;
            });
        }
      });

      return {
        ...state,
        product: newProduct,
        products: newProducts,
        userProducts: newUserProducts,
        similarProducts: newSimilarProducts,
        bookmarkedProducts: newBookmarkedProducts,
        bookmarkedProductsCount: newBookmarkedProductsCount,
        currentBookmarkedProductsCount: newCurrentBookmarkedProductsCount,
        recommendedHomeProducts: newRecommendedHomeProducts,
        productCategoryIdToHomeProductsMap:
          newProductCategoryIdToHomeProductsMap,
      };
    }
    case ProductActionTypes.SET_ALL_PRODUCT_LIKED: {
      const { id, liked } = action.payload;

      const newProducts = state.products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            islike: liked ? (1 as const) : (0 as const),
          };
        }
        return product;
      });

      const newUserProducts = state.userProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            islike: liked ? (1 as const) : (0 as const),
          };
        }
        return product;
      });

      const newProduct = state.product
        ? ({
            ...state.product,
            product: {
              ...state.product.product,
              islike: liked ? 1 : 0,
              like: state.product.product.like + (liked ? 1 : -1),
            },
          } as typeof state.product)
        : null;

      const newBookmarkedProducts = state.bookmarkedProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            islike: liked ? (1 as const) : (0 as const),
          };
        }
        return product;
      });

      const newSimilarProducts = state.similarProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            islike: liked ? (1 as const) : (0 as const),
          };
        }
        return product;
      });

      const newRecommendedHomeProducts = state.recommendedHomeProducts.map(
        (product) => {
          if (product.id === id) {
            return {
              ...product,
              islike: liked ? (1 as const) : (0 as const),
            };
          }
          return product;
        }
      );

      const newProductCategoryIdToHomeProductsMap = {
        ...state.productCategoryIdToHomeProductsMap,
      };
      const homeProductCategoryIds = Object.entries(
        newProductCategoryIdToHomeProductsMap
      ).map(
        ([index]) =>
          index as unknown as keyof typeof newProductCategoryIdToHomeProductsMap
      );
      homeProductCategoryIds.forEach((productCategoryId) => {
        const products =
          newProductCategoryIdToHomeProductsMap[productCategoryId];
        if (Array.isArray(products)) {
          const productIndex = products.findIndex((p) => p.id === id);
          if (productIndex > -1) {
            newProductCategoryIdToHomeProductsMap[productCategoryId] =
              products.map((product) => {
                if (product.id === id) {
                  return {
                    ...product,
                    islike: liked ? (1 as const) : (0 as const),
                  };
                }
                return product;
              });
          }
        }
      });

      return {
        ...state,
        products: newProducts,
        userProducts: newUserProducts,
        similarProducts: newSimilarProducts,
        product: newProduct,
        bookmarkedProducts: newBookmarkedProducts,
        recommendedHomeProducts: newRecommendedHomeProducts,
        productCategoryIdToHomeProductsMap:
          newProductCategoryIdToHomeProductsMap,
      };
    }

    case ProductActionTypes.SET_ALL_PRODUCT_STATE: {
      const { id, state: productState } = action.payload;

      const newProducts = state.products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            state: productState,
          };
        }
        return product;
      });

      const newUserProducts = state.userProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            state: productState,
          };
        }
        return product;
      });

      const newProduct = state.product
        ? ({
            ...state.product,
            product: {
              ...state.product.product,
              state: productState,
            },
          } as typeof state.product)
        : null;

      const newBookmarkedProducts = state.bookmarkedProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            state: productState,
          };
        }
        return product;
      });

      const newSimilarProducts = state.similarProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            state: productState,
          };
        }
        return product;
      });

      const newRecommendedHomeProducts = state.recommendedHomeProducts.map(
        (product) => {
          if (product.id === id) {
            return {
              ...product,
              state: productState,
            };
          }
          return product;
        }
      );

      const newProductCategoryIdToHomeProductsMap = {
        ...state.productCategoryIdToHomeProductsMap,
      };
      const homeProductCategoryIds = Object.entries(
        newProductCategoryIdToHomeProductsMap
      ).map(
        ([index]) =>
          index as unknown as keyof typeof newProductCategoryIdToHomeProductsMap
      );
      homeProductCategoryIds.forEach((productCategoryId) => {
        const products =
          newProductCategoryIdToHomeProductsMap[productCategoryId];
        if (Array.isArray(products)) {
          const productIndex = products.findIndex((p) => p.id === id);
          if (productIndex > -1) {
            newProductCategoryIdToHomeProductsMap[productCategoryId] =
              products.map((product) => {
                if (product.id === id) {
                  return {
                    ...product,
                    state: productState,
                  };
                }
                return product;
              });
          }
        }
      });

      return {
        ...state,
        products: newProducts,
        userProducts: newUserProducts,
        similarProducts: newSimilarProducts,
        product: newProduct,
        bookmarkedProducts: newBookmarkedProducts,
        recommendedHomeProducts: newRecommendedHomeProducts,
        productCategoryIdToHomeProductsMap:
          newProductCategoryIdToHomeProductsMap,
      };
    }
    case ProductActionTypes.SET_DRAFT_PRODUCT_SAGA: {
      return {
        ...state,
        draftProduct: action.payload,
      };
    }
    case ProductActionTypes.DELETE_DRAFT_PRODUCT_SUCCEEDED: {
      const { id } = action.payload;
      const newDraftProducts = [...state.draftProducts];
      const draftProductIndex = newDraftProducts.findIndex(
        (draftProduct) => draftProduct.id === id
      );
      if (draftProductIndex > -1) newDraftProducts.splice(draftProductIndex, 1);

      return {
        ...state,
        draftProducts: newDraftProducts,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
