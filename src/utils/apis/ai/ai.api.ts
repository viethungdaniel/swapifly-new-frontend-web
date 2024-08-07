import { authAxios } from "@/libs/axios";

import type {
  FetchAiStylesPayload,
  FetchAiStylesResponseData,
  FetchAiStyleDescriptionPayload,
  FetchAiStyleDescriptionResponseData,
} from "./ai.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const aiApi = {
  fetchAiStyles: (payload?: FetchAiStylesPayload) => {
    return authAxios.get<AxiosResponseData<FetchAiStylesResponseData>>(
      "vertex_ai/ai_styles",
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchAiStyleDescription: (payload: FetchAiStyleDescriptionPayload) => {
    return authAxios.get<
      AxiosResponseData<FetchAiStyleDescriptionResponseData>
    >("vertex_ai/get_description", {
      params: payload.params,
      cancelToken: payload?.cancelToken,
    });
  },
};

export default aiApi;
