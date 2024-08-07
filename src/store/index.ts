import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
// import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";

import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

import type { Store } from "@reduxjs/toolkit";
import type { AppState } from "./rootReducer";
import type { Task } from "redux-saga";

export interface SagaStore extends Store {
  sagaTask?: Task;
}

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
  });
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const reduxWrapper = createWrapper<Store<AppState>>(makeStore);

export type { AppState } from "./rootReducer";
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

export * as storeAuthAction from "./auth/action";
export * as storeCommonAction from "./common/action";
export * as storeProductCategoryAction from "./productCategory/action";
export * as storeProductConditionAction from "./productCondition/action";
export * as storeProductSortAction from "./productSort/action";
export * as storeBannerAction from "./banner/action";
export * as storeBrandAction from "./brand/action";
export * as storeProductAction from "./product/action";
export * as storeUserAction from "./user/action";
export * as storeReviewAction from "./review/action";
export * as storeNotificationAction from "./notification/action";
export * as storeHelpCenterAction from "./helpCenter/action";
export * as storeNewsItemAction from "./newsItem/action";
export * as storeInboxAction from "./inbox/action";
export * as storeWebsocketAction from "./websocket/action";
export * as storeAdAction from "./ad/action";

export * as storeCommonSelectors from "./common/selectors";
export * as storeProductCategorySelectors from "./productCategory/selectors";
export * as storeProductSelectors from "./product/selectors";
export * as storeProductConditionSelectors from "./productCondition/selectors";
export * as storeInboxSelectors from "./inbox/selectors";
export * as storeAdSelectors from "./ad/selectors";
export * as storeBannerSelectors from "./banner/selectors";
