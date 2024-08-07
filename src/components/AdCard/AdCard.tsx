import { forwardRef, memo } from "react";

import { appGtagService } from "@/services";
import { adHelpers, imageHelpers } from "@/utils/helpers";

import { Box, Skeleton } from "@mui/material";

import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";
import AppAvatar from "@/components/AppAvatar";
import AppTypography from "@/components/AppTypography";
import AppImage from "@/components/AppImage";

import OpenInNewIcon from "@@/public/images/icons/open-in-new.svg";

import { useTranslation } from "next-i18next";

import useStyles from "./AdCard.styles";

import type { BoxProps } from "@mui/material";
import type { AppImageProps } from "@/components/AppImage";
import type { FetchAdsResponseData } from "@/utils/apis/ad";

export type CustomProductAdCardProps = {
  fullHeight?: boolean;
  fullWidth?: boolean;
  ad?: Partial<FetchAdsResponseData[number]> | null;
  variant?: "filled" | "standard";
  skeletonLoading?: boolean;
  boxShadowVariant?: "card" | "standard";
  mediaShape?: "square" | "rectangle";
  ImageProps?: Omit<AppImageProps, "alt" | "src" | "fill">;
};

export type ProductAdCardProps = CustomProductAdCardProps &
  Omit<BoxProps, keyof CustomProductAdCardProps>;

const ProductAdCard = memo(
  forwardRef((props: ProductAdCardProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      fullWidth,
      fullHeight,
      skeletonLoading,
      variant = "standard",
      ad,
      boxShadowVariant = "standard",
      mediaShape = "square",
      ImageProps,
      ...rest
    } = props;

    const { t } = useTranslation();

    const { classes, theme, cx } = useStyles();

    const handleRootClick = () => {
      if (adHelpers.isAdProductsRectangleType(ad?.type))
        appGtagService.dispatchProductsSquareAdClickEvent({
          adRefName: ad?.ref_tilte!,
        });
      if (adHelpers.isAdProductsSquareType(ad?.type))
        appGtagService.dispatchProductsSquareAdClickEvent({
          adRefName: ad?.ref_tilte!,
        });
    };

    return (
      <Box
        className={cx(
          classes.root,
          {
            [classes.fullHeight]: !!fullHeight,
            [classes.fullWidth]: !!fullWidth,
            [classes.filled]: variant === "filled",
            [classes.standard]: variant === "standard",
            [classes.boxShadowCard]: boxShadowVariant === "card",
          },
          className
        )}
        ref={ref}
        {...(rest as any)}
        component={AppLink}
        {...adHelpers.getAdLink(ad!)}
        underline="none"
        hoverColor="none"
        onClick={handleRootClick}
      >
        {mediaShape === "square" ? (
          <div className={classes.media}>
            {!!skeletonLoading ? (
              <Skeleton
                className={classes.mediaPhoto}
                animation="wave"
                variant="rectangular"
              />
            ) : (
              <>
                {adHelpers.isAdImageMediaType(ad?.media_type) ? (
                  <AppImage
                    {...ImageProps}
                    className={cx(classes.mediaPhoto, ImageProps?.className)}
                    src={ad?.photo}
                    loader={imageHelpers.appImageLoader}
                    alt={`${ad?.title! ?? ""} - ${ad?.description! ?? ""}`}
                    fill
                    defaultPlaceholderVariant="default"
                  />
                ) : (
                  <video
                    className={classes.mediaPhoto}
                    playsInline
                    loop
                    autoPlay
                    muted
                  >
                    <source src={imageHelpers.imagePathLoader(ad?.video)} />
                  </video>
                )}
              </>
            )}
          </div>
        ) : (
          <div className={classes.mediaShapeRectangle}>
            {!!skeletonLoading ? (
              <Skeleton
                className={classes.mediaShapeRectanglePhoto}
                animation="wave"
                variant="rectangular"
              />
            ) : (
              <>
                {adHelpers.isAdImageMediaType(ad?.media_type) ? (
                  <AppImage
                    {...ImageProps}
                    className={cx(
                      classes.mediaShapeRectanglePhoto,
                      ImageProps?.className
                    )}
                    src={ad?.photo}
                    loader={imageHelpers.appImageLoader}
                    alt={`${ad?.title! ?? ""} - ${ad?.description! ?? ""}`}
                    width={theme.breakpoints.values.lg}
                    height={theme.breakpoints.values.lg}
                    defaultPlaceholderVariant="default"
                  />
                ) : (
                  <video
                    className={classes.mediaShapeRectanglePhoto}
                    playsInline
                    loop
                    autoPlay
                    muted
                  >
                    <source src={imageHelpers.imagePathLoader(ad?.video)} />
                  </video>
                )}
              </>
            )}
          </div>
        )}
        <div className={classes.content}>
          {skeletonLoading ? (
            <AppTypography className={classes.adDescription}>
              <Skeleton variant="text" />
            </AppTypography>
          ) : (
            !!ad?.description && (
              <AppTypography className={classes.adDescription}>
                {ad?.description}
              </AppTypography>
            )
          )}

          {skeletonLoading ? (
            <AppTypography variant="bodyMed16" className={classes.adTitle}>
              <Skeleton
                variant="text"
                sx={{ width: "8ch", maxWidth: "100%" }}
              />
            </AppTypography>
          ) : (
            !!ad?.title && (
              <AppTypography variant="bodyMed16" className={classes.adTitle}>
                {ad?.title}
              </AppTypography>
            )
          )}
          <Box flex={1} />
          <div className={classes.contentFooter}>
            <div className={classes.publisher}>
              {skeletonLoading ? (
                <Skeleton
                  className={classes.publisherAvatar}
                  variant="circular"
                />
              ) : (
                <AppAvatar
                  className={classes.publisherAvatar}
                  src={
                    !!ad?.ad_publisher?.avatar
                      ? imageHelpers.appImageLoader({
                          src: ad?.ad_publisher?.avatar,
                          width: 600,
                        })
                      : undefined
                  }
                  sx={{
                    bgcolor: !!ad?.ad_publisher?.avatar
                      ? undefined
                      : "common.blue",
                  }}
                >
                  <AppTypography
                    variant="captionMed12"
                    component="span"
                    color="white"
                  >
                    AD
                  </AppTypography>
                </AppAvatar>
              )}
              <AppTypography
                className={classes.publisherTitle}
                color="common.blue"
                noWrap
              >
                {skeletonLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{ width: "8ch", maxWidth: "100%" }}
                  />
                ) : (
                  t("sponsorAd")
                )}
              </AppTypography>
            </div>
            {!skeletonLoading && (
              <AppSvgIcon
                component={OpenInNewIcon}
                color="common.blue"
                sx={{ mr: "-2px" }}
              />
            )}
          </div>
        </div>
      </Box>
    );
  })
);

export default ProductAdCard;
