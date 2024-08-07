import { FetchAdsResponseData } from "@/utils/apis/ad";
import { adConstants } from "@/utils/constants";

export const isAdImageMediaType = (mediaType?: string) => {
  return mediaType === adConstants.AD_MEDIA_IMAGE_TYPE;
};

export const isAdVideoMediaType = (mediaType?: string) => {
  return mediaType === adConstants.AD_MEDIA_VIDEO_TYPE;
};

export const isAdBannersType = (type?: string) => {
  return type === adConstants.AD_BANNERS_TYPE;
};

export const isAdPopupType = (type?: string) => {
  return type === adConstants.AD_POPUP_TYPE;
};

export const isAdProductsRectangleType = (type?: string) => {
  return type === adConstants.AD_PRODUCTS_RECTANGLE_TYPE;
};

export const isAdProductsSquareType = (type?: string) => {
  return type === adConstants.AD_PRODUCTS_SQUARE_TYPE;
};

export const isAdProductType = (type?: string) => {
  return type === adConstants.AD_PRODUCT_TYPE;
};

export const isAdInboxThreadsType = (type?: string) => {
  return type === adConstants.AD_INBOX_THREADS_TYPE;
};

export const getAdLink = (ad?: Partial<FetchAdsResponseData[number]>) => {
  if (!ad) {
    return {
      href: "/",
      target: "_self",
    };
  }

  try {
    if (typeof window !== "undefined") {
      const adURL = new URL(ad?.link!);
      if (adURL.origin === window.location.origin) {
        return {
          href: `${adURL.pathname}${adURL.search}`,
          target: "_self",
        };
      }
    }
  } catch {}

  return {
    href: ad?.link!,
    target: "_blank",
  };
};
