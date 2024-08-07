import { combineReducers } from "@reduxjs/toolkit";

import auth from "./auth/reducer";
import common from "./common/reducer";
import productCategory from "./productCategory/reducer";
import banner from "./banner/reducer";
import brand from "./brand/reducer";
import product from "./product/reducer";
import user from "./user/reducer";
import productCondition from "./productCondition/reducer";
import productSort from "./productSort/reducer";
import review from "./review/reducer";
import notification from "./notification/reducer";
import helpCenter from "./helpCenter/reducer";
import newsItem from "./newsItem/reducer";
import inbox from "./inbox/reducer";
import websocket from "./websocket/reducer";
import ad from "./ad/reducer";

const rootReducer = combineReducers({
  auth,
  common,
  productCategory,
  productCondition,
  productSort,
  banner,
  brand,
  product,
  user,
  review,
  notification,
  helpCenter,
  newsItem,
  inbox,
  websocket,
  ad,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
