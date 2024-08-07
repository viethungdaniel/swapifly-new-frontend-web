import { all, fork } from "redux-saga/effects";

import auth from "./auth/sagas";
import common from "./common/sagas";
import productCategory from "./productCategory/sagas";
import productCondition from "./productCondition/sagas";
import productSort from "./productSort/sagas";
import banner from "./banner/sagas";
import brand from "./brand/sagas";
import product from "./product/sagas";
import user from "./user/sagas";
import review from "./review/sagas";
import notification from "./notification/sagas";
import helpCenter from "./helpCenter/sagas";
import newsItem from "./newsItem/sagas";
import inbox from "./inbox/sagas";
import ad from "./ad/sagas";

export default function* rootSaga() {
  yield all([
    fork(auth),
    fork(common),
    fork(productCategory),
    fork(productCondition),
    fork(productSort),
    fork(banner),
    fork(brand),
    fork(product),
    fork(user),
    fork(review),
    fork(notification),
    fork(helpCenter),
    fork(newsItem),
    fork(inbox),
    fork(ad),
  ]);
}
