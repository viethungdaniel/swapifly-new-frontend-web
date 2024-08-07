import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { productApi } from "@/utils/apis";
import { productConstants } from "@/utils/constants";

import { ProductActionTypes } from "./types";
import {
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
  mapFetchRequested,
  mapFetchSucceeded,
  mapFetchFailed,
  setAllProductBookmarked,
  setAllProductLiked,
  setAllProductState,
  deleteDraftProductSucceeded,
} from "./action";
import * as inboxAction from "@/store/inbox/action";

import type {
  FetchScope,
  FetchProductsSagaAction,
  FetchMapHomeProductsByProductCategoryIdSagaAction,
  MapFetchScope,
  FetchRecommendedHomeProductsSagaAction,
  AddProductBookmarkedSagaAction,
  RemoveProductBookmarkedSagaAction,
  LikeProductSagaAction,
  FetchProductSagaAction,
  FetchSimilarProductsSagaAction,
  FetchBookmarkedProductsSagaAction,
  FetchCurrentBookmarkedProductsCountSagaAction,
  FetchUserProductsSagaAction,
  MarkSoldProductSagaAction,
  FetchDraftProductsSagaAction,
  FetchDraftProductSagaAction,
  FetchRecommendedProductsSagaAction,
} from "./types";

import type { AppState } from "@/store";

function* fetchProductsSaga(action: FetchProductsSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "products" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchProducts>> = yield call(
      productApi.fetchProducts,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data?.pagination?.total ?? 0,
          isLoadMore,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchDraftProductsSaga(action: FetchDraftProductsSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "draftProducts" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchDraftProducts>> = yield call(
      productApi.fetchDraftProducts,
      {
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data ?? [],
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchDraftProductSaga(action: FetchDraftProductSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};
  const scope = "products" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchDraftProduct>> = yield call(
      productApi.fetchDraftProduct,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchUserProductsSaga(action: FetchUserProductsSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "userProducts" as FetchScope;

  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchProducts>> = yield call(
      productApi.fetchProducts,
      {
        params: {
          ...params,
          all_region: 1,
        },
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data?.pagination?.total ?? 0,
          isLoadMore,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchProductSaga(action: FetchProductSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};
  const scope = "product" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchProduct>> = yield call(
      productApi.fetchProduct,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axios.isAxiosError(error)
      ? (error.response?.data as any)?.message || error.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchRecommendedHomeProductsSaga(
  action: FetchRecommendedHomeProductsSagaAction
) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};

  const scope = "recommendedHomeProducts" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );
  const cookieToken: AppState["common"]["cookieToken"] = yield select(
    (state: AppState) => state.common.cookieToken
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchRecommendedProducts>> =
      yield call(productApi.fetchRecommendedProducts, {
        params: {
          all_region: 1,
          cookie_token: cookieToken,
          ...params,
        },
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data?.pagination?.total ?? 0,
          isLoadMore,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchRecommendedProductsSaga(
  action: FetchRecommendedProductsSagaAction
) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};

  const scope = "recommendedProducts" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );
  const cookieToken: AppState["common"]["cookieToken"] = yield select(
    (state: AppState) => state.common.cookieToken
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchRecommendedProducts>> =
      yield call(productApi.fetchRecommendedProducts, {
        params: {
          all_region: 1,
          cookie_token: cookieToken,
          ...params,
        },
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data?.pagination?.total ?? 0,
          isLoadMore,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchBookmarkedProductsSaga(
  action: FetchBookmarkedProductsSagaAction
) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};

  const scope = "bookmarkedProducts" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchBookmarkedProducts>> =
      yield call(productApi.fetchBookmarkedProducts, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data?.pagination?.total ?? 0,
          isLoadMore,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchCurrentBookmarkedProductsCountSaga(
  action: FetchCurrentBookmarkedProductsCountSagaAction
) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  const scope = "currentBookmarkedProductsCount" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchBookmarkedProducts>> =
      yield call(productApi.fetchBookmarkedProducts, {
        params: {
          ...params,
          type: "count",
        },
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data?.pagination?.total ?? 0,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchSimilarProductsSaga(action: FetchSimilarProductsSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};

  const scope = "similarProducts" as FetchScope;

  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchSimilarProducts>> = yield call(
      productApi.fetchSimilarProducts,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: (response.data.data ?? []).map((d) => ({
            ...d,
            id: (d as any).pid as number,
          })),
          count: response.data?.pagination?.total ?? 0,
          isLoadMore,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e: any) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? e.response?.data?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchMapHomeProductsByProductCategoryIdSaga(
  action: FetchMapHomeProductsByProductCategoryIdSagaAction
) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "productCategoryIdToHomeProducts" as MapFetchScope;
  const key = params.rid;

  const location: AppState["common"]["location"] = yield select(
    (state: AppState) => state.common.location
  );

  yield put(
    mapFetchRequested({
      scope,
      key,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.fetchProducts>> = yield call(
      productApi.fetchProducts,
      {
        params: {
          lat: location.latitude,
          lng: location.longitude,
          ...params,
        },
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        mapFetchSucceeded({
          scope,
          data: response.data.data ?? [],
          key,
        })
      );
    } else {
      yield put(
        mapFetchFailed({
          scope,
          error: response.message,
          key,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      mapFetchFailed({
        scope,
        error: message,
        key,
      })
    );
    resolve({ message });
  }
}

function* addProductBookmarkSaga(action: AddProductBookmarkedSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  yield put(
    setAllProductBookmarked({
      id: params.id,
      bookmarked: true,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.addProductBookmark>> = yield call(
      productApi.addProductBookmark,
      {
        params,
        cancelToken,
      }
    );
    if (!axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setAllProductBookmarked({
          id: params.id,
          bookmarked: false,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) {
      if (e.message === "componentUnmounted")
        yield put(
          setAllProductBookmarked({
            id: params.id,
            bookmarked: false,
          })
        );
      return;
    }
    yield put(
      setAllProductBookmarked({
        id: params.id,
        bookmarked: false,
      })
    );
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* removeProductBookmarkSaga(action: RemoveProductBookmarkedSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  yield put(
    setAllProductBookmarked({
      id: params.id,
      bookmarked: false,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.removeProductBookMark>> =
      yield call(productApi.removeProductBookMark, {
        params,
        cancelToken,
      });
    if (!axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setAllProductBookmarked({
          id: params.id,
          bookmarked: true,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) {
      if (e.message === "componentUnmounted")
        yield put(
          setAllProductBookmarked({
            id: params.id,
            bookmarked: true,
          })
        );
      return;
    }
    yield put(
      setAllProductBookmarked({
        id: params.id,
        bookmarked: true,
      })
    );
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* likeProductSaga(action: LikeProductSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  const liked = params.state === productConstants.LIKE_ID;

  yield put(
    setAllProductLiked({
      id: params.product_id,
      liked,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.likeProduct>> = yield call(
      productApi.likeProduct,
      {
        params,
        cancelToken,
      }
    );
    if (!axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setAllProductLiked({
          id: params.product_id,
          liked: !liked,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) {
      if (e.message === "componentUnmounted")
        yield put(
          setAllProductLiked({
            id: params.product_id,
            liked: !liked,
          })
        );
      return;
    }
    yield put(
      setAllProductLiked({
        id: params.product_id,
        liked: !liked,
      })
    );
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* markSoldProductSaga(action: MarkSoldProductSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.markSoldProduct>> = yield call(
      productApi.markSoldProduct,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setAllProductState({
          id: params.id,
          state: productConstants.SOLD_STATE_NUMBER,
        })
      );
      yield put(
        inboxAction.markSoldProductSucceeded({
          id: params.id,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* deleteProductSaga(action: MarkSoldProductSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.deleteProduct>> = yield call(
      productApi.deleteProduct,
      {
        params,
        cancelToken,
      }
    );
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* deleteDraftProductSaga(action: MarkSoldProductSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productApi.deleteDraftProduct>> = yield call(
      productApi.deleteDraftProduct,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      deleteDraftProductSucceeded({
        id: params.id,
      });
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* productSaga() {
  yield all([
    takeEvery(
      ProductActionTypes.FETCH_DRAFT_PRODUCT_SAGA,
      fetchDraftProductSaga
    ),
    takeEvery(
      ProductActionTypes.FETCH_DRAFT_PRODUCTS_SAGA,
      fetchDraftProductsSaga
    ),
    takeEvery(ProductActionTypes.FETCH_PRODUCTS_SAGA, fetchProductsSaga),
    takeEvery(ProductActionTypes.FETCH_PRODUCT_SAGA, fetchProductSaga),
    takeEvery(
      ProductActionTypes.FETCH_USER_PRODUCTS_SAGA,
      fetchUserProductsSaga
    ),
    takeEvery(
      ProductActionTypes.FETCH_RECOMMENDED_HOME_PRODUCTS_SAGA,
      fetchRecommendedHomeProductsSaga
    ),
    takeEvery(
      ProductActionTypes.FETCH_RECOMMENDED_PRODUCTS_SAGA,
      fetchRecommendedProductsSaga
    ),
    takeEvery(
      ProductActionTypes.FETCH_BOOKMARKED_PRODUCTS_SAGA,
      fetchBookmarkedProductsSaga
    ),
    takeLatest(
      ProductActionTypes.FETCH_CURRENT_BOOKMARKED_PRODUCTS_COUNT_SAGA,
      fetchCurrentBookmarkedProductsCountSaga
    ),
    takeEvery(
      ProductActionTypes.FETCH_SIMILAR_PRODUCTS_SAGA,
      fetchSimilarProductsSaga
    ),
    takeEvery(
      ProductActionTypes.FETCH_MAP_HOME_PRODUCTS_BY_PRODUCT_CATEGORY_ID_SAGA,
      fetchMapHomeProductsByProductCategoryIdSaga
    ),
    takeEvery(
      ProductActionTypes.ADD_PRODUCT_BOOKMARKED_SAGA,
      addProductBookmarkSaga
    ),
    takeEvery(
      ProductActionTypes.REMOVE_PRODUCT_BOOKMARKED_SAGA,
      removeProductBookmarkSaga
    ),
    takeEvery(ProductActionTypes.LIKE_PRODUCT_SAGA, likeProductSaga),
    takeEvery(ProductActionTypes.MARK_SOLD_PRODUCT_SAGA, markSoldProductSaga),
    takeEvery(ProductActionTypes.DELETE_PRODUCT_SAGA, deleteProductSaga),
    takeEvery(
      ProductActionTypes.DELETE_DRAFT_PRODUCT_SAGA,
      deleteDraftProductSaga
    ),
  ]);
}

export default productSaga;
