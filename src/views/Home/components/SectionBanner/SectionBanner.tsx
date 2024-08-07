import axios from "axios";
import { bindActionCreators } from "redux";

import { adHelpers, imageHelpers } from "@/utils/helpers";
import { storeBannerAction, storeBannerSelectors } from "@/store";
import { appGtagService } from "@/services";

import { SwiperSlide } from "swiper/react";
import { Box, Skeleton } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppImage from "@/components/AppImage";
import AppLink, { AppLinkProps } from "@/components/AppLink";
import AppSwiper from "@/components/AppSwiper";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useMemo, useRef } from "react";

import useStyles from "./SectionBanner.styles";

import type { CancelTokenSource } from "axios";

type BannerItemProps = {
  banner?: NonNullable<
    ReturnType<typeof storeBannerSelectors.selectAdWithBanners>[0]["banner"]
  > | null;
  bannersAd?: NonNullable<
    ReturnType<typeof storeBannerSelectors.selectAdWithBanners>[0]["bannersAd"]
  > | null;
};

const BannerItem = (props: BannerItemProps) => {
  const { banner, bannersAd } = props;

  const $s_desktopHomeBannerWidth = useAppSelector(
    (state) => state.common.settings.desktop_home_banner_resolution_width
  );
  const $s_desktopHomeBannerHeight = useAppSelector(
    (state) => state.common.settings.desktop_home_banner_resolution_height
  );
  const $s_mobileHomeBannerWidth = useAppSelector(
    (state) => state.common.settings.mobile_home_banner_resolution_width
  );
  const $s_mobileHomeBannerHeight = useAppSelector(
    (state) => state.common.settings.mobile_home_banner_resolution_height
  );

  const { classes, cx } = useStyles({
    desktopHomeBannerWidth: $s_desktopHomeBannerWidth,
    desktopHomeBannerHeight: $s_desktopHomeBannerHeight,
    mobileHomeBannerHeight: $s_mobileHomeBannerHeight,
    mobileHomeBannerWidth: $s_mobileHomeBannerWidth,
  });

  const bannerPhoto = useMemo(() => {
    if (bannersAd) return bannersAd.photo;
    return banner?.img;
  }, [banner, bannersAd]);

  const mobileBannerPhoto = useMemo(() => {
    if (bannersAd) return bannersAd.photo;
    return banner?.img_m;
  }, [banner, bannersAd]);

  const bannerTitle = useMemo(() => {
    if (bannersAd) return bannersAd.title;
    return banner?.title;
  }, [banner, bannersAd]);

  const bannerLinkProps = useMemo<AppLinkProps>(() => {
    if (bannersAd) return adHelpers.getAdLink(bannersAd);
    try {
      if (typeof window !== "undefined") {
        const bannerURL = new URL(banner?.link!);
        if (bannerURL.origin === window.location.origin) {
          return {
            href: `${bannerURL.pathname}${bannerURL.search}`,
            target: "_self",
          };
        }
      }
    } catch {}

    return {
      href: banner?.link!,
      target: "_blank",
    };
  }, [banner, bannersAd]);

  const handleBannerClick = () => {
    !!bannersAd &&
      appGtagService.dispatchBannersAdClickEvent({
        adRefName: bannersAd.ref_tilte,
      });
  };

  return (
    <div className={classes.bannerItem}>
      <AppImage
        className={cx(classes.bannerImage, classes.bannerItemSecondaryImage)}
        fill
        sizes="100vw"
        src={bannerPhoto}
        loader={imageHelpers.appImageLoader}
        quality={100}
        alt={bannerTitle}
        objectFit="cover"
        objectPosition="center"
      />
      <div className={classes.bannerItemBackgroundBlur}></div>
      <AppImage
        className={classes.bannerMobileImage}
        fill
        sizes="100vw"
        src={mobileBannerPhoto}
        loader={imageHelpers.appImageLoader}
        quality={100}
        alt={bannerTitle}
        objectFit="cover"
        objectPosition="center"
      />
      <div className={classes.bannerItemPrimary}>
        <AppContainer
          className={classes.bannerItemPrimaryContainer}
          maxWidth="xl"
          disableGutters
        >
          <Box
            {...(bannerLinkProps?.href
              ? ({
                  component: AppLink,
                  ...bannerLinkProps,
                } as any)
              : {})}
            onClick={handleBannerClick}
            className={classes.bannerItemPrimaryBanner}
          >
            <AppImage
              className={classes.bannerImage}
              fill
              sizes="100vw"
              src={bannerPhoto}
              loader={imageHelpers.appImageLoader}
              quality={100}
              alt={bannerTitle}
              objectFit="cover"
              objectPosition="center"
              defaultPlaceholderVariant="default"
            />
            <AppImage
              className={classes.bannerMobileImage}
              fill
              src={mobileBannerPhoto}
              loader={imageHelpers.appImageLoader}
              quality={100}
              alt={bannerTitle}
              objectFit="cover"
              objectPosition="center"
              defaultPlaceholderVariant="default"
            />
          </Box>
        </AppContainer>
      </div>
    </div>
  );
};

const SectionBanner = () => {
  const $s_desktopHomeBannerWidth = useAppSelector(
    (state) => state.common.settings.desktop_home_banner_resolution_width
  );
  const $s_desktopHomeBannerHeight = useAppSelector(
    (state) => state.common.settings.desktop_home_banner_resolution_height
  );
  const $s_mobileHomeBannerWidth = useAppSelector(
    (state) => state.common.settings.mobile_home_banner_resolution_width
  );
  const $s_mobileHomeBannerHeight = useAppSelector(
    (state) => state.common.settings.mobile_home_banner_resolution_height
  );

  const $s_adWithBanners = useAppSelector(
    storeBannerSelectors.selectAdWithBanners
  );
  const $s_bannersLoading = useAppSelector(
    (state) => state.banner.bannersLoading
  );
  const $s_bannersError = useAppSelector((state) => state.banner.bannersError);
  const $s_bannersAdsLoading = useAppSelector(
    (state) => state.ad.bannersAdsLoading
  );

  const { classes } = useStyles({
    desktopHomeBannerWidth: $s_desktopHomeBannerWidth,
    desktopHomeBannerHeight: $s_desktopHomeBannerHeight,
    mobileHomeBannerHeight: $s_mobileHomeBannerHeight,
    mobileHomeBannerWidth: $s_mobileHomeBannerWidth,
  });

  const dispatch = useAppDispatch();

  const fetchBannerSourceRef = useRef<CancelTokenSource>();

  const $s_bannerAction = useMemo(
    () => bindActionCreators(storeBannerAction, dispatch),
    [dispatch]
  );

  const fetchBanners = () => {
    fetchBannerSourceRef.current = axios.CancelToken.source();
    $s_bannerAction.fetchBannersSaga({
      cancelToken: fetchBannerSourceRef.current.token,
    });
  };

  useEffect(() => {
    fetchBanners();
    return () => {
      fetchBannerSourceRef.current?.cancel &&
        fetchBannerSourceRef.current.cancel();
    };
  }, []);

  if (
    $s_adWithBanners.length === 0 &&
    !$s_bannersLoading &&
    !$s_bannersAdsLoading
  )
    return null;

  return (
    <section className={classes.root}>
      {$s_bannersLoading || $s_bannersAdsLoading || !!$s_bannersError ? (
        <div className={classes.bannerLoading}>
          <AppContainer maxWidth="xl" disableGutters>
            <div className={classes.bannerLoadingSpacing} />
          </AppContainer>
          <Skeleton
            className={classes.bannerLoadingSkeleton}
            animation="wave"
            variant="rectangular"
          />
        </div>
      ) : (
        <Box>
          <AppSwiper
            pagination={{ enabled: true }}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
          >
            {$s_adWithBanners.map((adWithBanner, adWithBannerIndex) => {
              return (
                <SwiperSlide key={adWithBannerIndex}>
                  <BannerItem
                    banner={adWithBanner.banner}
                    bannersAd={adWithBanner.bannersAd}
                    key={adWithBannerIndex}
                  />
                </SwiperSlide>
              );
            })}
          </AppSwiper>
        </Box>
      )}
    </section>
  );
};

export default SectionBanner;
