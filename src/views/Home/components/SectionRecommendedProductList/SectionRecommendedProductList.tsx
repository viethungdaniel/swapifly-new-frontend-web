import { bindActionCreators } from "redux";
import axios from "axios";

import { storeProductAction, storeProductSelectors } from "@/store";

import { SwiperSlide } from "swiper/react";
import { Typography, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppButton from "@/components/AppButton";
import ProductCard from "@/containers/ProductCard";
import AppContent from "@/components/AppContent/AppContent";
import AppSwiper from "@/components/AppSwiper";
import AppLink from "@/components/AppLink";
import AdCard from "@/components/AdCard";
import ProductAdCard from "@/components/AdCard/AdCard";

import { useAppDispatch, useAppSelector, useAuthUser } from "@/hooks";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./SectionRecommendedProductList.styles";

import type { CancelTokenSource } from "axios";

const SectionRecommendedProductList = () => {
  const fetchBannerSourceRef = useRef<CancelTokenSource>();

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_recommendedHomeProductsLoading = useAppSelector(
    (state) => state.product.recommendedHomeProductsLoading
  );
  const $s_recommendedHomeProductsError = useAppSelector(
    (state) => state.product.recommendedHomeProductsError
  );
  const $s_adWithRecommendedHomeProducts = useAppSelector(
    storeProductSelectors.selectAdWithRecommendedHomeProducts
  );
  const $s_recommendedHomeProductsSquareAdsLoading = useAppSelector(
    (state) => state.ad.recommendedHomeProductsSquareAdsLoading
  );

  const { hasAuth } = useAuthUser();

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const sliderSettingsSlidesToShow = useMemo(() => {
    return isTabletDown ? 2 : 4;
  }, [isTabletDown]);

  const adWithRecommendedHomeProducts = useMemo(() => {
    if (
      $s_recommendedHomeProductsLoading ||
      $s_recommendedHomeProductsSquareAdsLoading ||
      !!$s_recommendedHomeProductsError
    )
      return [
        ...Array.from(Array(isTabletDown ? 4 : sliderSettingsSlidesToShow)),
      ].map(() => {
        return null;
      });
    return $s_adWithRecommendedHomeProducts;
  }, [
    isTabletDown,
    sliderSettingsSlidesToShow,
    $s_recommendedHomeProductsLoading,
    $s_recommendedHomeProductsSquareAdsLoading,
    $s_adWithRecommendedHomeProducts,
    $s_recommendedHomeProductsError,
  ]);

  const fetchBanners = () => {
    fetchBannerSourceRef.current = axios.CancelToken.source();
    $s_productAction.fetchRecommendedHomeProductsSaga({
      params: {
        page: 1,
        limit: 8,
      },
      cancelToken: fetchBannerSourceRef.current.token,
    });
  };

  useEffect(() => {
    fetchBanners();
    return () => {
      fetchBannerSourceRef.current?.cancel &&
        fetchBannerSourceRef.current.cancel();
    };
  }, [hasAuth]);

  if (
    $s_adWithRecommendedHomeProducts.length < 1 ||
    !!$s_recommendedHomeProductsError
  )
    return null;

  return (
    <section className={classes.root}>
      <AppContainer disableGutters={"tabletDown"}>
        <AppContent className={classes.content}>
          <Typography
            variant="headerSemi35"
            color="common.white"
            align="center"
          >
            {t("recommended")}
          </Typography>
          <AppSwiper
            key={$s_recommendedHomeProductsLoading ? "loading" : "unloading"}
            speed={1000}
            spaceBetween={20}
            slidesPerGroup={isTabletDown ? 1 : sliderSettingsSlidesToShow}
            navigation={{ enabled: !isTabletDown }}
            slidesPerView={isTabletDown ? "auto" : sliderSettingsSlidesToShow}
            centeredSlides={isTabletDown}
            roundLengths
            loop={isTabletDown}
          >
            {adWithRecommendedHomeProducts.map(
              (
                adWithRecommendedHomeProduct,
                adWithRecommendedHomeProductIndex
              ) => {
                if (!!adWithRecommendedHomeProduct?.recommendedHomeProduct)
                  return (
                    <SwiperSlide
                      className={classes.swiperSlide}
                      key={
                        !!adWithRecommendedHomeProduct?.recommendedHomeProduct
                          ?.id
                          ? `product-${adWithRecommendedHomeProduct?.recommendedHomeProduct?.id}`
                          : adWithRecommendedHomeProductIndex
                      }
                    >
                      <ProductCard
                        ImageProps={{
                          priority: true,
                        }}
                        fullHeight
                        fullWidth
                        variant="filled"
                        product={
                          adWithRecommendedHomeProduct.recommendedHomeProduct
                        }
                      />
                    </SwiperSlide>
                  );
                if (
                  !!adWithRecommendedHomeProduct?.recommendedHomeProductsSquareAd
                )
                  return (
                    <SwiperSlide
                      className={classes.swiperSlide}
                      key={
                        !!adWithRecommendedHomeProduct
                          ?.recommendedHomeProductsSquareAd?.id
                          ? `ad-${adWithRecommendedHomeProduct?.recommendedHomeProductsSquareAd?.id}`
                          : adWithRecommendedHomeProductIndex
                      }
                    >
                      <AdCard
                        ImageProps={{
                          priority: true,
                        }}
                        fullHeight
                        fullWidth
                        variant="filled"
                        ad={
                          adWithRecommendedHomeProduct.recommendedHomeProductsSquareAd
                        }
                      />
                    </SwiperSlide>
                  );
                return (
                  <SwiperSlide
                    className={classes.swiperSlide}
                    key={adWithRecommendedHomeProductIndex}
                  >
                    <ProductAdCard
                      fullHeight
                      fullWidth
                      variant="filled"
                      skeletonLoading
                    />
                  </SwiperSlide>
                );
              }
            )}
          </AppSwiper>
          <AppContainer className={classes.recommendedProductActions}>
            <AppButton
              variant="contained"
              color="common.white"
              component={AppLink}
              underline="none"
              hoverColor="inherit"
              href="/recommended"
              sx={{ width: 240 }}
            >
              {t("seeAll")}
            </AppButton>
          </AppContainer>
        </AppContent>
      </AppContainer>
    </section>
  );
};

export default SectionRecommendedProductList;
