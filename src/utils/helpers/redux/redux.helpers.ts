import { AxiosResponseData } from "@/libs/axios";

export const callActionWithPromise = <Ac extends (...args: any[]) => any>(
  actionCreator: Ac,
  // ...args: Parameters<Fn>
  payload?: Parameters<typeof actionCreator>[0],
  meta?: Parameters<typeof actionCreator>[1]
): Promise<AxiosResponseData> => {
  return new Promise((resolve) => {
    actionCreator(payload, {
      ...meta,
      resolve,
    });
  });
};
