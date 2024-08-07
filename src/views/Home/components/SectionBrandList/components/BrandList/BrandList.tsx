import { useAppSelector } from "@/hooks";
import { imageHelpers } from "@/utils/helpers";

import { Box, Skeleton, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppImage from "@/components/AppImage";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";
import AppContent from "@/components/AppContent/AppContent";
import AppSwiper, { AppSwiperProps } from "@/components/AppSwiper";
import { SwiperSlide } from "swiper/react";

import SectionBrandListContext from "@/views/Home/components/SectionBrandList/SectionBrandList.context";

import { useContext, useMemo } from "react";

import useStyles from "./BrandList.styles";

const BrandList = () => {
  const { brandsLimit, brandsPage, setBrandsPage, fetchBrands } = useContext(
    SectionBrandListContext
  );

  const $s_brands = useAppSelector((state) => state.brand.brands);
  const $s_brandsLoading = useAppSelector((state) => state.brand.brandsLoading);
  const $s_brandsError = useAppSelector((state) => state.brand.brandsError);
  const $s_brandsCount = useAppSelector((state) => state.brand.brandsCount);

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const slidesToShow = useMemo(() => {
    const showNumber = isSmDown ? 5 : isTabletDown ? 6 : 8;
    return showNumber;
  }, [isTabletDown, isSmDown, $s_brandsLoading, $s_brands]);

  const brands = useMemo(() => {
    if (
      ($s_brandsLoading || !!$s_brandsError) &&
      brandsPage === 1 &&
      $s_brands.length < 1
    )
      return [...Array.from(Array(slidesToShow))].map(() => {
        return null;
      });
    return $s_brands;
  }, [slidesToShow, $s_brandsLoading, $s_brands, $s_brandsError, brandsPage]);

  const hasNextPage = brandsPage * brandsLimit <= $s_brandsCount;

  const handleSlickChange: AppSwiperProps["onSlideChangeTransitionEnd"] = (
    swipe
  ) => {
    const nextSlide = swipe.activeIndex;
    const latestSlide = nextSlide + slidesToShow - 1;
    const latestSlideCount = $s_brands.length - latestSlide;
    const loadedLatestSlide = Math.round(slidesToShow / 2);

    if (
      !hasNextPage ||
      $s_brandsLoading ||
      latestSlideCount > loadedLatestSlide
    )
      return;

    const newBrandsPage = brandsPage + 1;
    setBrandsPage(newBrandsPage);
    fetchBrands(
      {
        params: {
          page: newBrandsPage,
        },
      },
      {
        isLoadMore: true,
      }
    );
  };

  if ($s_brands.length === 0 && !$s_brandsLoading) return null;

  return (
    <section className={classes.root}>
      <AppContainer>
        <AppContent>
          <AppSwiper
            classes={{
              navigationArrow: classes.swiperNavigationArrow,
            }}
            speed={1000}
            spaceBetween={isSmDown ? 16 : isTabletDown ? 24 : 32}
            navigation={{ enabled: true }}
            slidesPerView={slidesToShow}
            freeMode
            onSlideChangeTransitionEnd={handleSlickChange}
          >
            {brands.map((brand, brandIndex) => (
              <SwiperSlide key={brandIndex}>
                <Box
                  component={!!brand ? AppLink : "div"}
                  href={
                    !!brand
                      ? {
                          pathname: "/search",
                          query: {
                            brand: brand?.id,
                          },
                        }
                      : undefined
                  }
                  underline="none"
                  className={classes.brandItem}
                >
                  {brand && (
                    <>
                      <div className={classes.brandItemLogo}>
                        <AppImage
                          fill
                          sizes={`(max-width: ${
                            theme.breakpoints.values.sm
                          }px) ${Math.round(100 / 4)}vw, (max-width: ${
                            theme.breakpoints.values.md
                          }px) ${Math.round(100 / 6)}vw, ${Math.round(
                            100 / 8
                          )}vw`}
                          src={brand.img}
                          loader={imageHelpers.appImageLoader}
                          alt={brand.title}
                          objectFit="cover"
                          objectPosition="center"
                          priority
                          defaultPlaceholderVariant="default"
                        />
                      </div>
                      <AppTypography variant="bodyMed16" align="center" noWrap>
                        {brand.title}
                      </AppTypography>
                    </>
                  )}
                  {!brand && (
                    <>
                      <div className={classes.brandItemLoading}>
                        <Skeleton
                          className={classes.brandItemLoadingSkeleton}
                          animation="wave"
                          variant="circular"
                        />
                      </div>
                      <AppTypography variant="bodyMed16">
                        <Skeleton animation="wave" variant="text" />
                      </AppTypography>
                    </>
                  )}
                </Box>
              </SwiperSlide>
            ))}
            {($s_brandsLoading || (!$s_brandsLoading && !!$s_brandsError)) &&
              brandsPage > 1 && (
                <SwiperSlide>
                  <div className={classes.brandItem}>
                    <div className={classes.brandItemLoading}>
                      <Skeleton
                        className={classes.brandItemLoadingSkeleton}
                        animation="wave"
                        variant="circular"
                      />
                    </div>
                    <AppTypography variant="bodyMed16">
                      <Skeleton animation="wave" variant="text" />
                    </AppTypography>
                  </div>
                </SwiperSlide>
              )}
          </AppSwiper>
        </AppContent>
      </AppContainer>
    </section>
  );
};

export default BrandList;
