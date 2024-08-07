import axios from "axios";

import { commonApi } from "@/utils/apis";
import { commonHelpers } from "@/utils/helpers";

import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useAppSelector, useEventCallback } from "@/hooks";

import type { CancelTokenSource } from "axios";

export type PageAnalyticsProps = {
  data?: {
    productId?: EmptySafeNumber;
    productCategoryId?: EmptySafeNumber;
  };
};

const PageAnalytics = (props: PageAnalyticsProps) => {
  const { data } = props;

  const router = useRouter();

  const recordPageAnalyticsSourceRef = useRef<CancelTokenSource | null>(null);

  const $s_location = useAppSelector((state) => state.common.location);
  const $s_cookieToken = useAppSelector((state) => state.common.cookieToken);
  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const recordPageAnalytics = useEventCallback(async () => {
    recordPageAnalyticsSourceRef.current = axios.CancelToken.source();
    try {
      await commonApi.recordPageAnalytics({
        params: {
          category_id: commonHelpers.isNumber(data?.productCategoryId)
            ? Number(data?.productCategoryId)
            : "",
          product_id: commonHelpers.isNumber(data?.productId)
            ? Number(data?.productId)
            : "",
          lat: $s_location?.latitude ?? "",
          lng: $s_location?.longitude ?? "",
          token: $s_cookieToken,
          page_path: typeof window !== "undefined" ? window.location.href : "",
          user_agent: typeof window !== "undefined" ? navigator.userAgent : "",
        },
        cancelToken: recordPageAnalyticsSourceRef.current.token,
      });
    } catch {}
  });

  useEffect(() => {
    if (!router.isReady) return;
    recordPageAnalytics();
    return () => {
      recordPageAnalyticsSourceRef.current?.cancel &&
        recordPageAnalyticsSourceRef.current.cancel();
    };
  }, [router.isReady, data?.productCategoryId, data?.productId, $s_hasAuth]);

  return null;
};

export default PageAnalytics;
