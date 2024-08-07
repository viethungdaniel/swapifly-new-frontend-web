import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { adHelpers, axiosHelpers } from "@/utils/helpers";
import { adApi } from "@/utils/apis";
import { adConstants } from "@/utils/constants";

import { AdActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type { FetchAdsSagaAction } from "./types";

function* fetchAdsSaga(action: FetchAdsSagaAction) {
  const { params, cancelToken } = action.payload;
  const { isReset, resolve = () => {} } = action.meta || {};

  const scopeToAdTypeMap = {
    bannersAds: adConstants.AD_BANNERS_TYPE,
    popupAd: adConstants.AD_POPUP_TYPE,
    productsRectangleAds: adConstants.AD_PRODUCTS_RECTANGLE_TYPE,
    productsSquareAds: adConstants.AD_PRODUCTS_SQUARE_TYPE,
    productAd: adConstants.AD_PRODUCT_TYPE,
    inboxThreadsAds: adConstants.AD_INBOX_THREADS_TYPE,
    recommendedHomeProductsSquareAds: adConstants.AD_PRODUCTS_SQUARE_TYPE,
  } as {
    [scope: string]: string;
  };

  const scopes = params.scopes;

  let paramsAdTypes = scopes.map((scope) => scopeToAdTypeMap[scope]);
  paramsAdTypes =
    paramsAdTypes.length > 0
      ? paramsAdTypes
      : Object.entries(scopeToAdTypeMap).map(([_, adType]) => adType);

  yield all(
    scopes.map((scope) =>
      put(
        fetchRequested({
          scope,
          isReset,
        })
      )
    )
  );

  try {
    const { data: response }: Awaited<ReturnType<typeof adApi.fetchAds>> =
      yield call(adApi.fetchAds, {
        params: {
          platform: "website",
          types: paramsAdTypes,
        },
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield all(
        scopes.map((scope) => {
          if (["popupAd", "productAd"].includes(scope)) {
            return put(
              fetchSucceeded({
                scope,
                data:
                  (response.data ?? []).find((ad) => {
                    if (scope === "productAd")
                      return adHelpers.isAdProductType(ad.type);
                    return adHelpers.isAdPopupType(ad.type);
                  }) || null,
              })
            );
          }
          return put(
            fetchSucceeded({
              scope,
              data: (response.data ?? []).filter((ad) => {
                if (scope === "bannersAds")
                  return adHelpers.isAdBannersType(ad.type);
                if (scope === "productsRectangleAds")
                  return adHelpers.isAdProductsRectangleType(ad.type);
                if (scope === "productsSquareAds")
                  return adHelpers.isAdProductsSquareType(ad.type);
                if (scope === "inboxThreadsAds")
                  return adHelpers.isAdInboxThreadsType(ad.type);
                return true;
              }),
            })
          );
        })
      );
    } else {
      yield all(
        scopes.map((scope) =>
          put(
            fetchFailed({
              scope,
              error: response.message,
            })
          )
        )
      );
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    yield all(
      scopes.map((scope) =>
        put(
          fetchFailed({
            scope,
            error: message,
          })
        )
      )
    );
    resolve({ message });
  }
}

function* adSaga() {
  yield all([takeEvery(AdActionTypes.FETCH_ADS_SAGA, fetchAdsSaga)]);
}

export default adSaga;
