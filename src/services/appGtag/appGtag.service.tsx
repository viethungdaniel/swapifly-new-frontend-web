import { commonConfig } from "@/utils/config";

const checkGtagEventDispatchAble = () => {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag !== "undefined" &&
    commonConfig.NODE_ENV === "production"
  );
};

export const dispatchSignInEvent = (params: { email: string }) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "login", {
    item_name: params.email,
  });
};

export const dispatchSignUpEvent = (params: { email: string }) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "signup", {
    item_name: params?.email,
  });
};

export const dispatchSearchEvent = (params: { keyword: string }) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "search", {
    item_name: params?.keyword,
  });
};

export const dispatchShareEvent = (params: { title: string }) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "share", {
    item_name: params?.title,
  });
};

export const dispatchProductViewEvent = (params: { title: string }) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "product_view", {
    item_name: params?.title,
  });
};

export const dispatchUserViewEvent = (params: { username: string }) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "user_view", {
    item_name: params?.username,
  });
};

export const dispatchPageViewEvent = (params?: {
  title?: string;
  url?: string;
  pathname?: string;
}) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "page_view", {
    page_title: params?.title,
    page_location: params?.url,
    page_path: params?.pathname,
  });
};

export const dispatchPopupAdClickEvent = (params?: { adRefName?: string }) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "popup_ad", {
    page: "home",
    ad_ref_name: params?.adRefName,
  });
};

export const dispatchBannersAdClickEvent = (params?: {
  adRefName?: string;
}) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "banner", {
    page: "home",
    ad_ref_name: params?.adRefName,
  });
};

export const dispatchProductsSquareAdClickEvent = (params?: {
  adRefName?: string;
}) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "product_ad_square", {
    page: "product_list",
    ad_ref_name: params?.adRefName,
  });
};

export const dispatchProductsRectangleAdClickEvent = (params?: {
  adRefName?: string;
}) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "product_ad_rectangle", {
    page: "product_list",
    ad_ref_name: params?.adRefName,
  });
};

export const dispatchProductAdClickEvent = (params?: {
  adRefName?: string;
}) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "product_ad_rectangle", {
    page: "product_detail",
    ad_ref_name: params?.adRefName,
  });
};

export const dispatchInboxThreadsAdClickEvent = (params?: {
  adRefName?: string;
}) => {
  if (!checkGtagEventDispatchAble()) return;
  window.gtag("event", "inbox_ad", {
    page: "inbox",
    ad_ref_name: params?.adRefName,
  });
};
