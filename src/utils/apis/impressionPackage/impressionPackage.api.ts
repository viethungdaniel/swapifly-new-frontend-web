import { authAxios } from "@/libs/axios";

import type {
  FetchImpressionPackagesPayload,
  FetchImpressionPackagesResponseData,
} from "./impressionPackage.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const impressionPackageApi = {
  fetchImpressionPackages: (payload?: FetchImpressionPackagesPayload) => {
    return authAxios.get<
      AxiosResponseData<FetchImpressionPackagesResponseData>
    >("order/list_exposure", {
      cancelToken: payload?.cancelToken,
    });
  },
};

export default impressionPackageApi;
