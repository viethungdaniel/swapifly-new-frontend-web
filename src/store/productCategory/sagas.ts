import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers, productCategoryHelpers } from "@/utils/helpers";
import { productCategoryApi } from "@/utils/apis";

import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";
import { ProductCategoryActionTypes } from "./types";
import type { FetchProductCategoriesSagaAction, FetchScope } from "./types";

function* fetchProductCategoriesSaga(action: FetchProductCategoriesSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  const scope = "productCategories" as FetchScope;

  yield put(
    fetchRequested({
      scope,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productCategoryApi.fetchProductCategories>> =
      yield call(productCategoryApi.fetchProductCategories, {
        params,
        cancelToken,
      });

    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: productCategoryHelpers.mapProductCategories(
            response.data.data as any
          ),
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

function* productCategorySaga() {
  yield all([
    takeEvery(
      ProductCategoryActionTypes.FETCH_PRODUCT_CATEGORIES_SAGA,
      fetchProductCategoriesSaga
    ),
  ]);
}

export default productCategorySaga;
