import { authAxios } from "@/libs/axios";

import type {
  FetchProductConditionsPayload,
  FetchProductConditionsResponseData,
} from "./productCondition.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const productConditionApi = {
  fetchProductConditions: (payload?: FetchProductConditionsPayload) => {
    return authAxios.get<AxiosResponseData<FetchProductConditionsResponseData>>(
      "product_condition/index_by_language",
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default productConditionApi;
