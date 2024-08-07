import { commonConfig } from "@/utils/config";

import { Box } from "@mui/material";

import { forwardRef, useEffect } from "react";

import useStyles from "./AppGoogleAds.styles";

import type { BoxProps } from "@mui/material";

type CustomAppGoogleAdsProps = {
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
};
export type AppGoogleAdsProps = Omit<BoxProps, keyof CustomAppGoogleAdsProps> &
  CustomAppGoogleAdsProps;

const AppGoogleAds = forwardRef(
  (props: AppGoogleAdsProps, ref: React.ForwardedRef<any>) => {
    const {
      dataAdSlot,
      dataAdFormat = "auto",
      dataFullWidthResponsive = "true",
      className,
      ...rest
    } = props;

    const { classes, cx } = useStyles();

    useEffect(() => {
      if (typeof window === "undefined") return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }, []);

    return (
      <Box
        ref={ref}
        {...rest}
        component="ins"
        className={cx("adsbygoogle", classes.root, className)}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
        data-ad-client={`ca-pub-${commonConfig.GOOGLE_ADS_CLIENT_ID}`}
        data-ad-slot={dataAdSlot}
      />
    );
  }
);

export default AppGoogleAds;
