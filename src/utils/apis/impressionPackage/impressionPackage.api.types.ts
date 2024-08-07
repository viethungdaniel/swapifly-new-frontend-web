import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchImpressionPackagesPayload = Payload;
export type FetchImpressionPackagesResponseData = {
  id: number;
  number: number;
  days: number;
  price: number;
}[];
