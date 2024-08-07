import { forwardRef, memo, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import {
  axiosHelpers,
  commonHelpers,
  imageHelpers,
  productHelpers,
  reduxHelpers,
} from "@/utils/helpers";
import { storeProductAction } from "@/store";
import { productConstants } from "@/utils/constants";

import { Box, Divider, Skeleton } from "@mui/material";

import AppImage from "@/components/AppImage";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";
import AppAvatar from "@/components/AppAvatar";
import AppTypography from "@/components/AppTypography";
import AppChip from "@/components/AppChip";
import AppButton from "@/components/AppButton";
import ProductItemReportDialog from "@/containers/ProductItemReportDialog";
import ProductPurchaseVisitsFormDialog from "@/containers/ProductPurchaseVisitsFormDialog";
import AppTooltip from "@/components/AppTooltip";

import HeartOutlinedIcon from "@@/public/images/icons/heart-outlined.svg";
import BookmarkOutlinedIcon from "@@/public/images/icons/bookmark-outlined.svg";
import ShoppingCartVisitIcon from "@@/public/images/icons/shopping-cart-visit.svg";
import BarChartIncreaseIcon from "@@/public/images/icons/bar-chart-increase.svg";
import PlayIcon from "@@/public/images/icons/play.svg";

import { useAppDispatch, useAuthUser, useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./ProductCard.styles";

import type { FetchProductsResponseData } from "@/utils/apis/product";
import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { AppImageProps } from "@/components/AppImage";
import type { CancelTokenSource } from "axios";
import type {
  AddProductBookmarkedSagaAction,
  LikeProductSagaAction,
  RemoveProductBookmarkedSagaAction,
} from "@/store/product/types";

export type CustomProductCardProps = {
  fullHeight?: boolean;
  fullWidth?: boolean;
  product?: Partial<FetchProductsResponseData["data"][number]> | null;
  variant?: "filled" | "standard";
  skeletonLoading?: boolean;
  userVariant?: "owner" | "normal";
  boxShadowVariant?: "card" | "standard";
  ImageProps?: Omit<AppImageProps, "alt" | "src" | "fill">;
};

export type ProductCardProps = CustomProductCardProps &
  Omit<BoxProps, keyof CustomProductCardProps>;

type ProductCardTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & ProductCardProps;
  defaultComponent: D;
};
type ProductCardComponent = OverridableComponent<ProductCardTypeMap>;

const ReviewResultsButton = (props: {
  product?: CustomProductCardProps["product"];
}) => {
  const { product } = props;

  const [productItemReportDialogOpen, setProductItemReportDialogOpen] =
    useState(false);

  const { t } = useTranslation();

  const { classes } = useStyles();

  const handleProductItemReportDialogOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    handleEvent(event);
    setProductItemReportDialogOpen(true);
  };

  const handleProductItemReportDialogClose = () => {
    setProductItemReportDialogOpen(false);
  };

  const handleEvent = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      <AppTooltip title={t("reviewResults")}>
        <Box component="span" display="flex" width="100%" onClick={handleEvent}>
          <AppButton
            className={classes.reviewResultsButton}
            variant="containedTonal"
            color="common.darkNeutral"
            fullWidth
            onClick={handleProductItemReportDialogOpen}
          >
            <AppSvgIcon component={BarChartIncreaseIcon} fontSize="small" />
          </AppButton>
        </Box>
      </AppTooltip>
      <div onClick={handleEvent}>
        <ProductItemReportDialog
          productId={product?.id}
          disabledPurchaseVisits={
            !product?.purchase_enable ||
            product?.state !== productConstants.NORMAL_STATE_NUMBER
          }
          open={productItemReportDialogOpen}
          onClose={handleProductItemReportDialogClose}
        />
      </div>
    </>
  );
};

const PurchaseVisitsButton = (props: {
  product?: CustomProductCardProps["product"];
}) => {
  const { product } = props;

  const [
    productPurchaseVisitsFormDialogOpen,
    setProductPurchaseVisitsFormDialogOpen,
  ] = useState(false);

  const { t } = useTranslation();

  const { classes } = useStyles();

  const handleProductPurchaseVisitsFormDialogOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    handleEvent(event);
    setProductPurchaseVisitsFormDialogOpen(true);
  };

  const handleProductPurchaseVisitsFormDialogClose = () => {
    setProductPurchaseVisitsFormDialogOpen(false);
  };

  const handleEvent = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      <AppTooltip title={t("purchaseVisits")}>
        <Box component="span" display="flex" width="100%" onClick={handleEvent}>
          <AppButton
            className={classes.purchaseVisitsButton}
            variant="containedTonal"
            color="common.darkNeutral"
            fullWidth
            disabled={
              !product?.purchase_enable ||
              product?.state !== productConstants.NORMAL_STATE_NUMBER
            }
            onClick={handleProductPurchaseVisitsFormDialogOpen}
          >
            <AppSvgIcon component={ShoppingCartVisitIcon} fontSize="small" />
          </AppButton>
        </Box>
      </AppTooltip>
      <div onClick={handleEvent}>
        <ProductPurchaseVisitsFormDialog
          productId={product?.id!}
          open={productPurchaseVisitsFormDialogOpen}
          onClose={handleProductPurchaseVisitsFormDialogClose}
        />
      </div>
    </>
  );
};

const ProductCard = memo(
  forwardRef((props: ProductCardProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      fullWidth,
      fullHeight,
      skeletonLoading,
      variant = "standard",
      product,
      userVariant = "normal",
      boxShadowVariant = "standard",
      component,
      ImageProps,
      ...rest
    } = props;

    const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

    const { classes, theme, cx } = useStyles();

    const { t } = useTranslation();

    const changeProductBookmarkSourceRef = useRef<CancelTokenSource | null>(
      null
    );
    const likeProductSourceRef = useRef<CancelTokenSource | null>(null);

    const productVideos = useMemo(() => {
      let _videos: string[] = [];
      if (typeof product?.videos === "string") {
        try {
          const parsedProductVideos = JSON.parse(product?.videos);
          _videos = Array.isArray(parsedProductVideos)
            ? parsedProductVideos
            : [];
        } catch {}
      } else if (Array.isArray(product?.videos)) _videos = product?.videos!;
      return _videos;
    }, [product?.videos]);

    const hasVideo =
      (productVideos?.length ?? 0) > 0 || !!product?.youtube_link;

    const dispatch = useAppDispatch();

    const $s_productAction = useMemo(
      () => bindActionCreators(storeProductAction, dispatch),
      [dispatch]
    );

    const addProductBookmark = async (
      payload: AddProductBookmarkedSagaAction["payload"]
    ) => {
      const response = await reduxHelpers.callActionWithPromise(
        $s_productAction.addProductBookmarkedSaga,
        {
          ...payload,
        }
      );
      if (!isMounted()) return;
      if (!axiosHelpers.checkRequestSuccess(response)) {
        toast.error(response.message);
      }
    };

    const removeProductBookmark = async (
      payload: RemoveProductBookmarkedSagaAction["payload"]
    ) => {
      const response = await reduxHelpers.callActionWithPromise(
        $s_productAction.removeProductBookmarkedSaga,
        {
          ...payload,
        }
      );
      if (!isMounted()) return;
      if (!axiosHelpers.checkRequestSuccess(response)) {
        toast.error(response.message);
      }
    };

    const likeProduct = async (payload: LikeProductSagaAction["payload"]) => {
      const response = await reduxHelpers.callActionWithPromise(
        $s_productAction.likeProductSaga,
        {
          ...payload,
        }
      );
      if (!isMounted()) return;
      if (!axiosHelpers.checkRequestSuccess(response)) {
        toast.error(response.message);
      }
    };

    const handleIsCheckedBookmarkChange = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      changeProductBookmarkSourceRef.current?.cancel &&
        changeProductBookmarkSourceRef.current.cancel();
      changeProductBookmarkSourceRef.current = axios.CancelToken.source();

      event.preventDefault();
      event.stopPropagation();
      if (!hasAuth) {
        openSignInAndSignUpDialog();
        return;
      }
      if (!product?.id) return;

      if (!!!product?.bookmark)
        addProductBookmark({
          params: {
            id: product.id,
          },
          cancelToken: changeProductBookmarkSourceRef.current.token,
        });
      else
        removeProductBookmark({
          params: {
            id: product.id,
          },
          cancelToken: changeProductBookmarkSourceRef.current.token,
        });
    };

    const handleIsLikedChange = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      likeProductSourceRef.current?.cancel &&
        likeProductSourceRef.current.cancel();
      likeProductSourceRef.current = axios.CancelToken.source();
      event.preventDefault();
      event.stopPropagation();
      if (!hasAuth) {
        openSignInAndSignUpDialog();
        return;
      }
      if (!product?.id) return;

      likeProduct({
        params: {
          product_id: product.id!,
          state: !!!product?.islike
            ? productConstants.LIKE_ID
            : productConstants.UN_LIKE_ID,
        },
        cancelToken: likeProductSourceRef.current.token,
      });
    };

    const defaultLinkProps = !component
      ? {
          component: AppLink,
          href: `/${commonHelpers.generateProductSlug(
            product?.title,
            product?.id
          )}`,
          underline: "none",
          hoverColor: "none",
        }
      : {};

    useEffect(() => {
      return () => {
        changeProductBookmarkSourceRef.current?.cancel &&
          changeProductBookmarkSourceRef.current.cancel("componentUnmounted");
        likeProductSourceRef.current?.cancel &&
          likeProductSourceRef.current.cancel("componentUnmounted");
      };
    }, []);

    const isMounted = useIsMounted();

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
        {...rest}
        {...defaultLinkProps}
      >
        <div className={cx(classes.media, hasVideo && classes.hasVideo)}>
          {!!skeletonLoading ? (
            <Skeleton
              className={classes.mediaPhoto}
              animation="wave"
              variant="rectangular"
            />
          ) : (
            <>
              <AppImage
                sizes={`(max-width: ${
                  theme.breakpoints.values.sm
                }px) ${Math.round(100 / 2)}vw, (max-width: ${
                  theme.breakpoints.values.tablet
                }px) ${Math.round(100 / 3)}vw, ${Math.round(100 / 4)}vw`}
                {...ImageProps}
                className={cx(classes.mediaPhoto, ImageProps?.className)}
                src={product?.image}
                loader={imageHelpers.appImageLoader}
                alt={product?.title!}
                fill
                defaultPlaceholderVariant="default"
              />
              <div className={classes.mediaPlacementLeftTop}>
                <div className={classes.mediaTagList}>
                  {!!product?.condition && (
                    <AppChip
                      label={product.condition}
                      borderRadius="rounded"
                      color="text.primary"
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className={classes.mediaPlacementRightTop}>
                <AppIconButton
                  edge="xy"
                  borderRadius="circular"
                  className={cx(
                    classes.iconButton,
                    classes.heartOutlinedIconButton,
                    !!product?.islike && classes.hightLighted
                  )}
                  onClick={handleIsLikedChange}
                >
                  <AppSvgIcon
                    component={HeartOutlinedIcon}
                    fontSize="inherit"
                  />
                </AppIconButton>
              </div>
              {(productHelpers.isSoldProduct(product?.state!) ||
                !!product?.hot_pick) && (
                <div className={classes.mediaPlacementLeftBottom}>
                  <div className={classes.mediaTagList}>
                    {productHelpers.isSoldProduct(product?.state!) ? (
                      <AppChip
                        className={classes.mediaTagItemBottom}
                        label={t("sold")}
                        borderRadius="rounded"
                        color="text.primary"
                      />
                    ) : !!product?.hot_pick ? (
                      <>
                        <AppChip
                          className={classes.mediaTagItemBottom}
                          label={t("hotPicks")}
                          borderRadius="rounded"
                          color="primary.main"
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              )}
              {hasVideo && (
                <div className={classes.mediaPlacementRightBottom}>
                  <AppSvgIcon
                    component={PlayIcon}
                    className={classes.playIcon}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className={classes.content}>
          {skeletonLoading ? (
            <AppTypography className={classes.productName}>
              <Skeleton variant="text" />{" "}
            </AppTypography>
          ) : (
            !!product?.title && (
              <AppTypography className={classes.productName}>
                {product?.title}
              </AppTypography>
            )
          )}

          {skeletonLoading ? (
            <AppTypography
              variant="bodyMed16"
              color="primary.main"
              className={classes.productPrice}
            >
              <Skeleton
                variant="text"
                sx={{ width: "8ch", maxWidth: "100%" }}
              />
            </AppTypography>
          ) : (
            (typeof product?.state === "undefined" ||
              product?.state === productConstants.NORMAL_STATE_NUMBER) && (
              <AppTypography
                variant="bodyMed16"
                color="primary.main"
                className={classes.productPrice}
              >
                {product?.currency} {product?.price}
              </AppTypography>
            )
          )}

          <Box flex={1} />
          <div className={classes.contentActions}>
            <div className={classes.user}>
              {skeletonLoading ? (
                <Skeleton className={classes.userAvatar} variant="circular" />
              ) : (
                <AppAvatar
                  className={classes.userAvatar}
                  src={imageHelpers.appImageLoader({
                    src: product?.avatar,
                  })}
                />
              )}
              <AppTypography
                className={classes.userName}
                color="textSecondary"
                noWrap
              >
                {skeletonLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{ width: "8ch", maxWidth: "100%" }}
                  />
                ) : (
                  product?.nickname
                )}
              </AppTypography>
            </div>
            {!skeletonLoading && (
              <AppIconButton
                edge="xy"
                borderRadius="circular"
                className={cx(
                  classes.iconButton,
                  classes.bookmarkOutlinedIconButton,
                  !!product?.bookmark && classes.hightLighted
                )}
                onClick={handleIsCheckedBookmarkChange}
              >
                <AppSvgIcon
                  component={BookmarkOutlinedIcon}
                  fontSize="inherit"
                />
              </AppIconButton>
            )}
          </div>
        </div>
        {userVariant === "owner" && !skeletonLoading && (
          <div className={classes.ownerActions}>
            <PurchaseVisitsButton product={product} />
            <ReviewResultsButton product={product} />
            <Divider
              orientation="vertical"
              className={classes.ownerActionsDivider}
            />
          </div>
        )}
      </Box>
    );
  })
);

export default ProductCard as ProductCardComponent;
