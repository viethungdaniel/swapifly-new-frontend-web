import { authAxios } from "@/libs/axios";

import type {
  SubmitImpressionPackageOrderPayload,
  SubmitImpressionPackageOrderResponseData,
  CheckImpressionPackageOrderCouponCodePayload,
  CheckImpressionPackageOrderCouponCodeResponseData,
  DispatchImpressionPackageOrderPaymentCallbackPayload,
  DispatchImpressionPackageOrderPaymentCallbackResponseData,
} from "./impressionPackageOrder.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const impressionPackageOrderApi = {
  submitImpressionPackageOrder: (
    payload: SubmitImpressionPackageOrderPayload
  ) => {
    return authAxios.post<
      AxiosResponseData<SubmitImpressionPackageOrderResponseData>
    >("order/buy_exposure", payload.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  checkImpressionPackageOrderCouponCode: (
    payload: CheckImpressionPackageOrderCouponCodePayload
  ) => {
    return authAxios.post<
      AxiosResponseData<CheckImpressionPackageOrderCouponCodeResponseData>
    >("order/apply_promo_code", payload.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  dispatchImpressionPackageOrderPaymentCallback: (
    payload: DispatchImpressionPackageOrderPaymentCallbackPayload
  ) => {
    return authAxios.post<
      AxiosResponseData<DispatchImpressionPackageOrderPaymentCallbackResponseData>
    >("order/order_payment_callback", payload.params, {
      cancelToken: payload?.cancelToken,
      headers: payload?.headers,
    });
  },
};

export default impressionPackageOrderApi;
