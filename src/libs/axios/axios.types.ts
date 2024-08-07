export type AxiosResponseData<D = any> = {
  data: D;
  success: boolean;
  message: string;
};
