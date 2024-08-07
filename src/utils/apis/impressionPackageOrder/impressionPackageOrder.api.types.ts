import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type SubmitImpressionPackageOrderPayload = {
  params: {
    product_id: number;
    exposure_id: number;
    promotion_code?: string;
    redirect_pathname?: string;
  };
} & Payload;
export type SubmitImpressionPackageOrderResponseData = {
  id: string;
  url: string;
};

export type CheckImpressionPackageOrderCouponCodePayload = {
  params: {
    exposure_id: number;
    promotion_code: string;
  };
} & Payload;
export type CheckImpressionPackageOrderCouponCodeResponseData = {
  subtotal: number;
  discount: number;
  total: number;
  code: string;
};

export type DispatchImpressionPackageOrderPaymentCallbackPayload = {
  params: {
    order_id: string;
    success: number;
  };
} & Payload;
export type DispatchImpressionPackageOrderPaymentCallbackResponseData = {
  result: number;
  product_id?: number;
};
