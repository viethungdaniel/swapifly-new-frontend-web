import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchProductSortsPayload = Payload;
export type FetchProductSortsResponseData = {
  id: number;
  title: string;
}[];
