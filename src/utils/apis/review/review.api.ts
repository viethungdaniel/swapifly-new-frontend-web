import { authAxios } from "@/libs/axios";

import type {
  FetchReviewsPayload,
  FetchReviewsResponseData,
} from "./review.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const reviewApi = {
  fetchReviews: (payload: FetchReviewsPayload) => {
    const { user_id, ...params } = payload?.params;

    return authAxios.get<AxiosResponseData<FetchReviewsResponseData>>(
      `review/index/${user_id}`,
      {
        params: params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default reviewApi;
