import { storageKeyConstants } from "@/utils/constants";

import { appStorageService, storageService } from "..";
import { OptionsType } from "cookies-next/lib/types";

export const getToken = (payload?: { cookieOptions: OptionsType }) => {
  return (
    storageService.getCookieItem(
      storageKeyConstants.AUTH_TOKEN,
      payload?.cookieOptions
    ) || ""
  );
};

export const saveToken = (
  token: string,
  payload?: {
    cookieOptions: OptionsType;
  }
) => {
  storageService.saveCookieItem(storageKeyConstants.AUTH_TOKEN, token, {
    ...payload?.cookieOptions,
    // secure: true,
  });
};

export const destroyToken = (payload?: { cookieOptions: OptionsType }) => {
  appStorageService.destroyCookieAuthUserId();
  storageService.destroyCookieItem(
    storageKeyConstants.AUTH_TOKEN,
    payload?.cookieOptions
  );
};
