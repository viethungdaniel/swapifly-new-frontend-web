import { storageService } from "..";
import { storageKeyConstants } from "@/utils/constants";

import type { OptionsType } from "cookies-next/lib/types";
import type { AppState } from "@/store";

export const getStorageDefaultAuthUserRegion = () => {
  return storageService.getLocalItem<AppState["common"]["region"]>(
    storageKeyConstants.DEFAULT_AUTH_USER_REGION
  );
};
export const saveStorageDefaultAuthUserRegion = (region: any) => {
  storageService.saveLocalItem(
    storageKeyConstants.DEFAULT_AUTH_USER_REGION,
    region
  );
};

export const getStorageAuthUserRegion = () => {
  return storageService.getLocalItem<AppState["common"]["region"]>(
    storageKeyConstants.AUTH_USER_REGION
  );
};
export const saveStorageAuthUserRegion = (region: any) => {
  storageService.saveLocalItem(storageKeyConstants.AUTH_USER_REGION, region);
};

export const saveCookieAuthUserRegionId = (
  regionId: number,
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.AUTH_USER_REGION_ID,
    regionId,
    options
  );
};
export const getCookieAuthUserRegionId = (options?: OptionsType) => {
  return storageService.getCookieItem<number>(
    storageKeyConstants.AUTH_USER_REGION_ID,
    options
  );
};

export const getCookieLocation = (options?: OptionsType) => {
  const latitude =
    storageService.getCookieItem<number>(
      storageKeyConstants.AUTH_USER_LOCATION_LATITUDE,
      options
    ) ?? "";
  const longitude =
    storageService.getCookieItem<number>(
      storageKeyConstants.AUTH_USER_LOCATION_LONGITUDE,
      options
    ) ?? "";
  return { latitude, longitude };
};
export const saveCookieLocation = (
  location: { longitude?: EmptySafeNumber; latitude?: EmptySafeNumber },
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.AUTH_USER_LOCATION_LATITUDE,
    location?.longitude ?? "",
    options
  );
  storageService.saveCookieItem(
    storageKeyConstants.AUTH_USER_LOCATION_LONGITUDE,
    location?.latitude ?? "",
    options
  );
};

export const getCookieAuthUserId = (options?: OptionsType) => {
  return (
    storageService.getCookieItem<number>(
      storageKeyConstants.AUTH_USER_ID,
      options
    ) ?? null
  );
};
export const destroyCookieAuthUserId = (options?: OptionsType) => {
  storageService.destroyCookieItem(storageKeyConstants.AUTH_USER_ID, options);
};
export const saveCookieAuthUserId = (
  userId: number | null,
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.AUTH_USER_ID,
    userId,
    options
  );
};

export const saveCookieImpressionPackageOrderPaymentCallbackResponse = (
  data: {
    data: {
      order_id: string;
      product_id?: number | null;
      is_app_callback?: boolean;
    };
    message: string;
    success: boolean;
  },
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.IMPRESSION_PACKAGE_ORDER_PAYMENT_CALLBACK_RESPONSE,
    data,
    {
      maxAge: 59,
      ...options,
    }
  );
};
export const getCookieImpressionPackageOrderPaymentCallbackResponse = (
  options?: OptionsType
) => {
  return (
    storageService.getCookieItem<{
      data: {
        order_id: string;
        product_id?: number | null;
        is_app_callback?: boolean;
      };
      message: string;
      success: boolean;
    }>(
      storageKeyConstants.IMPRESSION_PACKAGE_ORDER_PAYMENT_CALLBACK_RESPONSE,
      options
    ) ?? ""
  );
};
export const destroyImpressionPackageOrderPaymentCallbackResponse = (
  options?: OptionsType
) => {
  storageService.destroyCookieItem(
    storageKeyConstants.IMPRESSION_PACKAGE_ORDER_PAYMENT_CALLBACK_RESPONSE,
    options
  );
};

export const saveCookieWechatSignInCallbackResponse = (
  data: {
    message: string;
    success: boolean;
  },
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.WECHAT_SIGN_IN_CALLBACK_RESPONSE,
    data,
    {
      maxAge: 59,
      ...options,
    }
  );
};
export const getCookieWechatSignInCallbackResponse = (
  options?: OptionsType
) => {
  return (
    storageService.getCookieItem<{
      message: string;
      success: boolean;
    }>(storageKeyConstants.WECHAT_SIGN_IN_CALLBACK_RESPONSE, options) ?? ""
  );
};
export const destroyWechatSignInCallbackResponse = (options?: OptionsType) => {
  storageService.destroyCookieItem(
    storageKeyConstants.WECHAT_SIGN_IN_CALLBACK_RESPONSE,
    options
  );
};

export const saveCookieWechatBindingCallbackResponse = (
  data: {
    message: string;
    success: boolean;
  },
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.WECHAT_BINDING_CALLBACK_RESPONSE,
    data,
    {
      maxAge: 59,
      ...options,
    }
  );
};
export const getCookieWechatBindingCallbackResponse = (
  options?: OptionsType
) => {
  return (
    storageService.getCookieItem<{
      message: string;
      success: boolean;
    }>(storageKeyConstants.WECHAT_BINDING_CALLBACK_RESPONSE, options) ?? ""
  );
};
export const destroyWechatBindingCallbackResponse = (options?: OptionsType) => {
  storageService.destroyCookieItem(
    storageKeyConstants.WECHAT_BINDING_CALLBACK_RESPONSE,
    options
  );
};

export const saveCookieAuthWeChatSignInSessionId = (
  sessionId: string,
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.AUTH_WECHAT_SIGNIN_SESSION_ID,
    sessionId,
    {
      maxAge: 600, // 10p
      path: "/api/auth/wechat/callback",
      httpOnly: true,
      secure: true,
      ...options,
    }
  );
};
export const getCookieAuthWeChatSignInSessionId = (options?: OptionsType) => {
  return (
    storageService.getCookieItem<string>(
      storageKeyConstants.AUTH_WECHAT_SIGNIN_SESSION_ID,
      options
    ) ?? ""
  );
};
export const destroyCookieAuthWeChatSignInSessionId = (
  options?: OptionsType
) => {
  storageService.destroyCookieItem(
    storageKeyConstants.AUTH_WECHAT_SIGNIN_SESSION_ID,
    {
      path: "/api/auth/wechat/callback",
      ...options,
    }
  );
};

export const saveCookieAuthWeChatBindingSessionId = (
  sessionId: string,
  options?: OptionsType
) => {
  storageService.saveCookieItem(
    storageKeyConstants.AUTH_WECHAT_BINDING_SESSION_ID,
    sessionId,
    {
      maxAge: 600, // 10p
      path: "/api/auth/wechat/callback",
      httpOnly: true,
      secure: true,
      ...options,
    }
  );
};
export const getCookieAuthWeChatBindingSessionId = (options?: OptionsType) => {
  return (
    storageService.getCookieItem<string>(
      storageKeyConstants.AUTH_WECHAT_BINDING_SESSION_ID,
      options
    ) ?? ""
  );
};
export const destroyCookieAuthWeChatBindingSessionId = (
  options?: OptionsType
) => {
  storageService.destroyCookieItem(
    storageKeyConstants.AUTH_WECHAT_BINDING_SESSION_ID,
    {
      path: "/api/auth/wechat/callback",
      ...options,
    }
  );
};

export const saveCookieLocale = (locale: string, options?: OptionsType) => {
  storageService.saveCookieItem(storageKeyConstants.APP_LOCALE, locale, {
    ...options,
  });
};
