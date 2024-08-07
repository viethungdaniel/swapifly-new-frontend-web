import _camelCase from "lodash/camelCase";
import { toast } from "react-toastify";
import axios from "axios";
import { bindActionCreators } from "redux";

import { appGtagService } from "@/services";
import { productConstants } from "@/utils/constants";
import { storeProductAction } from "@/store";
import { commonConfig } from "@/utils/config";
import {
  axiosHelpers,
  commonHelpers,
  imageHelpers,
  reduxHelpers,
} from "@/utils/helpers";

import { Box, Grid, useMediaQuery } from "@mui/material";
import ReactPlayer from "react-player";
import { SwiperSlide } from "swiper/react";
import AppSwiper from "@/components/AppSwiper";
import ShareDialog from "@/components/ShareDialog";
import GalleryDialog from "@/components/GalleryDialog";
import AppIconButton from "@/components/AppIconButton";
import AppBadge from "@/components/AppBadge/AppBadge";
import AppSvgIcon from "@/components/AppSvgIcon/AppSvgIcon";
import AppImage from "@/components/AppImage";
import AppPosition from "@/components/AppPosition/AppPosition";
import AppButton from "@/components/AppButton";
import ProductReportDialog from "@/components/ProductReportDialog";

import BookmarkOutlinedIcon from "@@/public/images/icons/bookmark-outlined.svg";
import HeartOutlinedIcon from "@@/public/images/icons/heart-outlined.svg";
import FlagIcon from "@@/public/images/icons/flag.svg";
import PhotoIcon from "@@/public/images/icons/photo.svg";
import VideoIcon from "@@/public/images/icons/video.svg";
import IosShareIcon from "@@/public/images/icons/ios-share.svg";
import PlayFilledSvg from "@@/public/images/svgs/play-filled.svg";

import ProductGalleryContext from "@/views/SlugProduct/components/ProductGallery/ProductGallery.context";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, useAuthUser } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./ProductGallery.styles";

import type { CancelTokenSource } from "axios";
import type { GalleryDialogProps } from "@/components/GalleryDialog";
import type { ShareDialogProps } from "@/components/ShareDialog";
import type {
  AddProductBookmarkedSagaAction,
  RemoveProductBookmarkedSagaAction,
} from "@/store/product/types";
import type { ProductGalleryContextValue } from "@/views/SlugProduct/components/ProductGallery/ProductGallery.context";

const BookmarkButton = () => {
  const bookmarkProductSourceRef = useRef<CancelTokenSource | null>(null);

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_productId = useAppSelector(
    (state) => state.product.product?.product?.id
  );

  const $s_productBookmarked =
    useAppSelector((state) => state.product.product?.bookmark) ?? (0 as const);

  const { classes, theme, cx } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const addProductBookmark = async (
    payload: AddProductBookmarkedSagaAction["payload"]
  ) => {
    const response = await reduxHelpers.callActionWithPromise(
      $s_productAction.addProductBookmarkedSaga,
      {
        ...payload,
      }
    );
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
    if (!axiosHelpers.checkRequestSuccess(response)) {
      toast.error(response.message);
    }
  };

  const handleBookmarkCheckedChange = () => {
    if (!$s_productId) return;
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    bookmarkProductSourceRef.current?.cancel &&
      bookmarkProductSourceRef.current.cancel();
    bookmarkProductSourceRef.current = axios.CancelToken.source();
    if ($s_productBookmarked)
      removeProductBookmark({
        params: {
          id: $s_productId,
        },
        cancelToken: bookmarkProductSourceRef.current.token,
      });
    else
      addProductBookmark({
        params: {
          id: $s_productId,
        },
        cancelToken: bookmarkProductSourceRef.current.token,
      });
  };

  useEffect(() => {
    return () => {
      bookmarkProductSourceRef.current?.cancel &&
        bookmarkProductSourceRef.current.cancel("componentUnmounted");
    };
  }, []);

  return isTabletDown ? (
    <AppIconButton
      variant="contained"
      color="common.white"
      onClick={handleBookmarkCheckedChange}
    >
      <AppSvgIcon
        className={cx(
          classes.bookmarkIcon,
          !!$s_productBookmarked && classes.checked
        )}
        component={BookmarkOutlinedIcon}
        fontSize="inherit"
      />
    </AppIconButton>
  ) : (
    <AppButton
      variant="contained"
      color="common.white"
      borderRadius="circular"
      startIcon={
        <AppSvgIcon
          className={cx(
            classes.bookmarkIcon,
            !!$s_productBookmarked && classes.checked
          )}
          component={BookmarkOutlinedIcon}
          fontSize="inherit"
        />
      }
      onClick={handleBookmarkCheckedChange}
    >
      {t("bookmark")}
    </AppButton>
  );
};

const LikeButton = () => {
  const likeProductSourceRef = useRef<CancelTokenSource | null>(null);

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_productId = useAppSelector(
    (state) => state.product.product?.product?.id
  );

  const $s_productLiked =
    useAppSelector((state) => state.product.product?.product?.islike) ??
    (0 as const);

  const { classes, theme, cx } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const handleLikeCheckedChange = () => {
    if (!$s_productId) return;
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    likeProductSourceRef.current?.cancel &&
      likeProductSourceRef.current.cancel();
    likeProductSourceRef.current = axios.CancelToken.source();

    $s_productAction.likeProductSaga({
      params: {
        product_id: $s_productId,
        state: $s_productLiked
          ? productConstants.UN_LIKE_ID
          : productConstants.LIKE_ID,
      },
      cancelToken: likeProductSourceRef.current.token,
    });
  };

  useEffect(() => {
    return () => {
      likeProductSourceRef.current?.cancel &&
        likeProductSourceRef.current.cancel("componentUnmounted");
    };
  }, []);

  return isTabletDown ? (
    <AppIconButton
      variant="contained"
      color="common.white"
      onClick={handleLikeCheckedChange}
    >
      <AppSvgIcon
        className={cx(classes.likeIcon, !!$s_productLiked && classes.checked)}
        component={HeartOutlinedIcon}
        fontSize="inherit"
      />
    </AppIconButton>
  ) : (
    <AppButton
      variant="contained"
      color="common.white"
      borderRadius="circular"
      startIcon={
        <AppSvgIcon
          className={cx(classes.likeIcon, !!$s_productLiked && classes.checked)}
          component={HeartOutlinedIcon}
          fontSize="inherit"
        />
      }
      onClick={handleLikeCheckedChange}
    >
      {t("like")}
    </AppButton>
  );
};

const ShareButton = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareDialogData, setShareDialogData] =
    useState<ShareDialogProps["data"]>(null);

  const $s_productTitle =
    useAppSelector((state) => state.product.product?.product?.title) ?? "";
  const $s_productDescribe =
    useAppSelector((state) => state.product.product?.product?.describe) ?? "";
  const $s_productCategories =
    useAppSelector((state) => state.product.product?.product?.rid) ?? [];

  const { t } = useTranslation();

  const productCategoryHashtags = useMemo(() => {
    return $s_productCategories.map((productCategory) => {
      return _camelCase(productCategory.title).toLowerCase();
    });
  }, [$s_productCategories]);

  const { theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const handleShareDialogOpen = () => {
    appGtagService.dispatchShareEvent({
      title: $s_productTitle,
    });
    setShareDialogOpen(true);
    setShareDialogData({
      url: window.location.href,
      title: $s_productTitle,
      text: $s_productDescribe,
      hashtag: [
        _camelCase(commonConfig.DOCUMENT_TITLE).toLowerCase(),
        ...productCategoryHashtags,
      ],
    });
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  return (
    <>
      {isTabletDown ? (
        <AppIconButton
          variant="contained"
          color="common.white"
          onClick={handleShareDialogOpen}
        >
          <AppSvgIcon component={IosShareIcon} fontSize="inherit" />
        </AppIconButton>
      ) : (
        <AppButton
          variant="contained"
          color="common.white"
          borderRadius="circular"
          startIcon={<AppSvgIcon component={IosShareIcon} fontSize="inherit" />}
          onClick={handleShareDialogOpen}
        >
          {t("share")}
        </AppButton>
      )}
      <ShareDialog
        open={shareDialogOpen}
        data={shareDialogData}
        onClose={handleShareDialogClose}
      />
    </>
  );
};

const ReportButton = () => {
  const [productReportDialogOpen, setProductReportDialogOpen] = useState(false);

  const { hasAuth, openSignInAndSignUpDialog } = useAuthUser();

  const $s_productId =
    useAppSelector((state) => state.product.product?.product?.id) || null;

  const { theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const handleProductReportDialogOpen = () => {
    if (!hasAuth) {
      openSignInAndSignUpDialog();
      return;
    }
    setProductReportDialogOpen(true);
  };

  const handleProductReportDialogClose = () => {
    setProductReportDialogOpen(false);
  };

  return (
    <>
      {isTabletDown ? (
        <AppIconButton
          variant="contained"
          color="common.white"
          onClick={handleProductReportDialogOpen}
        >
          <AppSvgIcon component={FlagIcon} fontSize="inherit" />
        </AppIconButton>
      ) : (
        <AppButton
          variant="contained"
          color="common.white"
          borderRadius="circular"
          startIcon={<AppSvgIcon component={FlagIcon} fontSize="inherit" />}
          onClick={handleProductReportDialogOpen}
        >
          {t("report")}
        </AppButton>
      )}
      <ProductReportDialog
        productId={$s_productId}
        open={productReportDialogOpen}
        onClose={handleProductReportDialogClose}
        onProductReportSubmitSucceed={handleProductReportDialogClose}
      />
    </>
  );
};

const VideoButton = () => {
  const { galleryItems, openGalleryDialog } = useContext(ProductGalleryContext);

  const { t } = useTranslation();

  const galleryItemVideos = useMemo(() => {
    return galleryItems.filter((galleryItem) =>
      ["youtube", "video"].includes(galleryItem.type)
    );
  }, [galleryItems]);

  const { theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const handleGalleryDialogOpen = () => {
    openGalleryDialog(galleryItemVideos);
  };

  if (galleryItemVideos.length < 1) return;

  return (
    <>
      {isTabletDown ? (
        <AppBadge color="common.dotRed" badgeContent={galleryItemVideos.length}>
          <AppIconButton
            variant="contained"
            color="common.white"
            onClick={handleGalleryDialogOpen}
          >
            <AppSvgIcon component={VideoIcon} fontSize="inherit" />
          </AppIconButton>
        </AppBadge>
      ) : (
        <AppButton
          variant="contained"
          color="common.white"
          borderRadius="circular"
          startIcon={<AppSvgIcon component={VideoIcon} fontSize="inherit" />}
          onClick={handleGalleryDialogOpen}
        >
          {t("videoWithCount", {
            count: galleryItemVideos.length,
          })}
        </AppButton>
      )}
    </>
  );
};

const ImageButton = () => {
  const { galleryItems, openGalleryDialog } = useContext(ProductGalleryContext);

  const galleryItemImages = useMemo(() => {
    return galleryItems.filter((galleryItem) => galleryItem.type === "image");
  }, [galleryItems]);

  const { theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const handleGalleryDialogOpen = () => {
    openGalleryDialog(galleryItemImages);
  };

  if (galleryItemImages.length < 1) return;

  return (
    <>
      {isTabletDown ? (
        <AppBadge color="common.dotRed" badgeContent={galleryItemImages.length}>
          <AppIconButton
            variant="contained"
            color="common.white"
            onClick={handleGalleryDialogOpen}
          >
            <AppSvgIcon component={PhotoIcon} fontSize="inherit" />
          </AppIconButton>
        </AppBadge>
      ) : (
        <AppButton
          variant="contained"
          color="common.white"
          borderRadius="circular"
          startIcon={<AppSvgIcon component={PhotoIcon} fontSize="inherit" />}
          onClick={handleGalleryDialogOpen}
        >
          {t("imageWithCount", {
            count: galleryItemImages.length,
          })}
        </AppButton>
      )}
    </>
  );
};

const ProductGalleryItem = (props: {
  galleryItem: ProductGalleryContextValue["galleryItems"][number];
  visible?: boolean;
}) => {
  const { galleryItem, visible } = props;

  const { openGalleryDialog } = useContext(ProductGalleryContext);

  const [playIconShow, setPlayIconShow] = useState(false);

  const { classes, theme } = useStyles();

  const youtubeReactPlayerRef = useRef<any>();
  const youtubeReactPlayerPlayingRef = useRef(true);

  const videoReactPlayerRef = useRef<any>();
  const videoStartedRef = useRef(false);

  const handleGalleryItemClick = () => {
    if (galleryItem.type === "video") {
      if (
        !!videoReactPlayerRef.current &&
        !!videoReactPlayerRef.current.getInternalPlayer()
      ) {
        const video =
          videoReactPlayerRef.current.getInternalPlayer() as HTMLVideoElement;
        if (!videoStartedRef.current) {
          videoStartedRef.current = true;
          return;
        }
        if (!video) return;
        if (video.paused) {
          setPlayIconShow(false);
          video.play();
        } else {
          setPlayIconShow(true);
          video.pause();
          openGalleryDialog([galleryItem]);
        }
      }
      return;
    }
    if (galleryItem.type === "youtube") {
      if (
        !!youtubeReactPlayerRef.current &&
        !!youtubeReactPlayerRef.current.getInternalPlayer()
      ) {
        const youtubeVideo = youtubeReactPlayerRef.current.getInternalPlayer();
        if (!youtubeVideo?.pauseVideo) return;
        youtubeVideo.pauseVideo();
        if (!youtubeReactPlayerPlayingRef.current) {
          youtubeReactPlayerPlayingRef.current = true;
          setPlayIconShow(false);
          youtubeVideo.playVideo();
        } else {
          youtubeReactPlayerPlayingRef.current = false;
          setPlayIconShow(true);
          youtubeVideo.pauseVideo();
          openGalleryDialog([galleryItem]);
        }
      } else {
        youtubeReactPlayerRef.current.handleClickPreview(
          youtubeReactPlayerRef.current.wrapper
        );
        youtubeReactPlayerPlayingRef.current = true;
      }
      return;
    }
    openGalleryDialog([galleryItem]);
  };

  useEffect(() => {
    if (
      youtubeReactPlayerRef.current &&
      youtubeReactPlayerRef.current.getInternalPlayer() &&
      videoStartedRef.current
    ) {
      if (!visible) {
        youtubeReactPlayerRef.current.getInternalPlayer().pauseVideo();
        youtubeReactPlayerPlayingRef.current = false;
      } else {
        youtubeReactPlayerRef.current.getInternalPlayer().playVideo();
        youtubeReactPlayerPlayingRef.current = true;
      }
    }

    if (
      !!videoReactPlayerRef.current &&
      !!videoReactPlayerRef.current.getInternalPlayer() &&
      videoStartedRef.current
    ) {
      if (!visible) {
        setPlayIconShow(true);
        videoReactPlayerRef.current.getInternalPlayer().pause();
      } else {
        setPlayIconShow(false);
        videoReactPlayerRef.current.getInternalPlayer().play();
      }
    }
  }, [visible]);

  return (
    <div className={classes.galleryItem} onClick={handleGalleryItemClick}>
      {galleryItem.type === "image" && (
        <AppImage
          className={classes.galleryItemPhoto}
          src={galleryItem.mediaData}
          loader={imageHelpers.appImageLoader}
          alt={galleryItem.title}
          fill
          sizes={`(max-width: ${theme.breakpoints.values.tablet}px) 100vw, 33vw`}
          defaultPlaceholderVariant="default"
        />
      )}
      {galleryItem.type === "youtube" && (
        <>
          <div className={classes.galleryItemYoutubeVideoBackground}></div>
          <ReactPlayer
            ref={youtubeReactPlayerRef}
            className={classes.galleryItemVideo}
            url={commonHelpers.formatYoutubeUrl(galleryItem.src)}
            width={"100%"}
            height={"100%"}
            playing={visible}
            // playsinline
            // light
            playIcon={
              <AppSvgIcon component={PlayFilledSvg} sx={{ fontSize: 50 }} />
            }
            config={{
              youtube: {
                playerVars: {
                  autoplay: visible,
                  frameborder: 0,
                  controls: 0,
                  mute: 1,
                },

                onUnstarted: () => {
                  videoStartedRef.current = true;
                },
              },
            }}
          />
        </>
      )}
      {galleryItem.type === "video" && (
        <ReactPlayer
          ref={videoReactPlayerRef}
          className={classes.galleryItemVideo}
          url={galleryItem.src}
          width={"100%"}
          height={"100%"}
          // playsinline
          // light={imageHelpers.optimizedImageLoader({
          //   src: galleryItem.thumbnail,
          // })}
          loop={true}
          muted={true}
          playing={visible}
          playIcon={
            <AppSvgIcon component={PlayFilledSvg} sx={{ fontSize: 50 }} />
          }
          onPlay={() => {
            videoStartedRef.current = true;
          }}
        />
      )}
      {galleryItem.type === "video" && playIconShow && (
        <AppSvgIcon
          className={classes.galleryItemPlayIcon}
          component={PlayFilledSvg}
          sx={{ fontSize: 50 }}
        />
      )}
    </div>
  );
};

const ProductGalleryGrid = () => {
  const { galleryItems } = useContext(ProductGalleryContext);

  const { classes } = useStyles();

  return (
    <Grid className={classes.gallery} container justifyContent={"center"}>
      {galleryItems.map((galleryItem, galleryItemIndex) => (
        <Grid key={galleryItemIndex} item xs={4}>
          <ProductGalleryItem visible galleryItem={galleryItem} />
        </Grid>
      ))}
    </Grid>
  );
};

const ProductGallerySwiper = () => {
  const { galleryItems } = useContext(ProductGalleryContext);

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <AppSwiper
      className={classes.gallery}
      slidesPerView={isTabletDown ? 1 : 3}
      virtual={{
        enabled: true,
        addSlidesBefore: 3,
        addSlidesAfter: 3,
      }}
      navigation={{
        enabled: true,
      }}
      classes={{
        navigationArrowNext: classes.gallerySwiperNavigationArrowNext,
        navigationArrowPrev: classes.gallerySwiperNavigationArrowPrev,
      }}
      pagination={{
        enabled: true,
      }}
    >
      {galleryItems.map((galleryItem, galleryItemIndex) => (
        <SwiperSlide key={galleryItemIndex} virtualIndex={galleryItemIndex}>
          {({ isVisible }) => {
            return (
              <ProductGalleryItem
                visible={isVisible}
                galleryItem={galleryItem}
              />
            );
          }}
        </SwiperSlide>
      ))}
    </AppSwiper>
  );
};

const ProductGallery = () => {
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [galleryDialogItems, setGalleryDialogItems] = useState<
    GalleryDialogProps["items"]
  >([]);

  const $s_productImage = useAppSelector(
    (state) => state.product.product?.product.image
  );
  const $s_productImages = useAppSelector(
    (state) => state.product.product?.product.images
  );
  const $s_productVideos = useAppSelector(
    (state) => state.product.product?.product.videos_obj
  );
  const $s_productYoutubeLink = useAppSelector(
    (state) => state.product.product?.product.youtube_link
  );

  const $s_productTitle =
    useAppSelector((state) => state.product.product?.product?.title) ?? "";
  const $s_productDescribe =
    useAppSelector((state) => state.product.product?.product?.describe) ?? "";
  const $s_productCategories =
    useAppSelector((state) => state.product.product?.product?.rid) ?? [];

  const productCategoryHashtags = useMemo(() => {
    return $s_productCategories.map((productCategory) => {
      return _camelCase(productCategory.title).toLowerCase();
    });
  }, [$s_productCategories]);

  const galleryItems = useMemo<
    ProductGalleryContextValue["galleryItems"]
  >(() => {
    const shareData = {
      title: $s_productTitle,
      text: $s_productDescribe,
      hashtag: [
        _camelCase(commonConfig.DOCUMENT_TITLE).toLowerCase(),
        ...productCategoryHashtags,
      ],
    };

    const images: ProductGalleryContextValue["galleryItems"] = (
      $s_productImages ?? []
    ).map((productImage) => {
      return {
        src: imageHelpers.imagePathLoader(productImage),
        mediaData: productImage,
        title: $s_productTitle,
        thumbnail: imageHelpers.imagePathLoader(productImage),
        type: "image",
        shareData: {
          url: imageHelpers.imagePathLoader(productImage),
          ...shareData,
        },
      };
    });
    const videos: ProductGalleryContextValue["galleryItems"] = (
      $s_productVideos ?? []
    ).map((productVideo) => {
      return {
        src: imageHelpers.imagePathLoader(productVideo.video),
        mediaData: productVideo.video,
        title: $s_productTitle,
        thumbnail: imageHelpers.imagePathLoader(productVideo.thumbnail),
        type: "video",
        shareData: {
          url: imageHelpers.imagePathLoader(productVideo.video),
          ...shareData,
        },
      };
    });
    const youtubeVideos: ProductGalleryContextValue["galleryItems"] =
      !!$s_productYoutubeLink
        ? [
            {
              src: $s_productYoutubeLink,
              mediaData: $s_productYoutubeLink,
              title: $s_productTitle,
              type: "youtube",
              shareData: {
                url: $s_productYoutubeLink,
                ...shareData,
              },
            },
          ]
        : [];
    return [...videos, ...youtubeVideos, ...images];
  }, [
    $s_productImages,
    $s_productVideos,
    $s_productYoutubeLink,
    $s_productTitle,
    $s_productDescribe,
    productCategoryHashtags,
  ]);

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const openGalleryDialog = (
    galleyDialogItems: GalleryDialogProps["items"]
  ) => {
    setGalleryDialogItems(galleyDialogItems);
    setGalleryDialogOpen(true);
  };

  const handleGalleryDialogClose = () => {
    setGalleryDialogOpen(false);
  };

  return (
    <ProductGalleryContext.Provider
      value={{
        galleryItems,
        openGalleryDialog,
      }}
    >
      <GalleryDialog
        open={galleryDialogOpen}
        items={galleryDialogItems}
        onClose={handleGalleryDialogClose}
      />
      <div className={classes.root}>
        <Box
          className={classes.galleryBackground}
          sx={{
            "--background-image": $s_productImage
              ? `url(${imageHelpers.appImageLoader({
                  src: $s_productImage,
                })})`
              : "",
          }}
        >
          <div className={classes.galleryBackgroundBlur}></div>
        </Box>

        {(isTabletDown || galleryItems.length >= 3) && <ProductGallerySwiper />}
        {!isTabletDown && galleryItems.length < 3 && <ProductGalleryGrid />}

        <AppPosition
          gutter="medium"
          position="absolute"
          placement="top-end"
          sx={{ zIndex: 2 }}
        >
          <div className={classes.actions}>
            <BookmarkButton />
            <LikeButton />
            <ShareButton />
            <ReportButton />
          </div>
        </AppPosition>
        <AppPosition
          gutter="medium"
          position="absolute"
          placement="bottom-end"
          sx={{ zIndex: 2 }}
        >
          <div className={classes.actions}>
            <VideoButton />
            <ImageButton />
          </div>
        </AppPosition>
      </div>
    </ProductGalleryContext.Provider>
  );
};

export default ProductGallery;
