import { authAxios } from "@/libs/axios";

import type {
  FetchProductReportPayload,
  FetchProductReportResponseData,
} from "./productReport.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const productReportApi = {
  fetchProductReport: (payload: FetchProductReportPayload) => {
    return authAxios.get<AxiosResponseData<FetchProductReportResponseData>>(
      `product/report/${payload.params.product_id}`,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default productReportApi;
