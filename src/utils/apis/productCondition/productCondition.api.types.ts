import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchProductConditionsPayload = Payload;
export type FetchProductConditionsResponseData = {
  id: number;
  title: string;
  advice: string;
}[];
