import ReactPlayer from "react-player";

import { commonHelpers } from "@/utils/helpers";

import {
  ButtonBase,
  Dialog,
  DialogContent,
  useMediaQuery,
} from "@mui/material";
import {
  FixedCropper,
  ImageRestriction,
  getTransformedImageSize,
} from "react-advanced-cropper";
import { SwiperSlide } from "swiper/react";
import AppSwiper from "@/components/AppSwiper";
import AppImage from "@/components/AppImage";
import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppIconButton from "@/components/AppIconButton";
import ShareDialog from "@/components/ShareDialog";

import AppSvgIcon from "@/components/AppSvgIcon";
import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";
import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";
import IosShareIcon from "@@/public/images/icons/ios-share.svg";
import DownloadIcon from "@@/public/images/icons/download.svg";
import CloseIcon from "@@/public/images/icons/close.svg";
import Rotate90BoxLeftIcon from "@@/public/images/icons/rotate-90-box-left.svg";
import Rotate90BoxRightIcon from "@@/public/images/icons/rotate-90-box-right.svg";
import ZoomInIcon from "@@/public/images/icons/zoom-in.svg";
import ZoomOutIcon from "@@/public/images/icons/zoom-out.svg";
import MaximizeIcon from "@@/public/images/icons/maximize.svg";
import PlayFilledSvg from "@@/public/images/svgs/play-filled.svg";

import {
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEventListener, useIsMounted } from "@/hooks";

import useStyles from "./GalleryDialog.styles";

import type { AppSwiperProps } from "@/components/AppSwiper";
import type {
  CropperState,
  DefaultSettings,
  FixedCropperRef,
} from "react-advanced-cropper";
import type { ShareDialogProps } from "@/components/ShareDialog";

export type PhotoItemApiRef = {
  maximizeImage: Function;
  rotateLeftImage: Function;
  rotateRightImage: Function;
  zoomInImage: Function;
  zoomOutImage: Function;
};

type PhotoItemProps = {
  src: string;
  apiRef?: React.ForwardedRef<PhotoItemApiRef>;
};

type GalleryItem = {
  src: string;
  thumbnail?: string;
  title: string;
  subTitle?: string;
  type: "image" | "youtube" | "video";
  shareData?: ShareDialogProps["data"];
};

export type GalleryDialogProps = {
  items: GalleryItem[];
  selectedItemIndex?: number;
  open?: boolean;
  onClose?: Function;
};

const PhotoItem = (props: PhotoItemProps) => {
  const { src, apiRef } = props;

  const { classes } = useStyles();

  const cropperRef = useRef<FixedCropperRef>(undefined!);
  const cropperResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const getCropperDefaultSize = ({ imageSize, visibleArea }: CropperState) => {
    return {
      width: (visibleArea || imageSize).width,
      height: (visibleArea || imageSize).height,
    };
  };

  const handleWindowResize = () => {
    cropperResetTimeoutRef.current = setTimeout(() => {
      cropperRef.current.reset();
    }, 150);
  };

  const rotateLeftImage = () => {
    cropperRef.current.rotateImage(-90);
  };

  const rotateRightImage = () => {
    cropperRef.current.rotateImage(90);
  };

  const zoomInImage = () => {
    cropperRef.current.zoomImage(1.5);
  };

  const zoomOutImage = () => {
    cropperRef.current.zoomImage(0.5);
  };

  const maximizeImage = () => {
    const cropperState = cropperRef.current.getDefaultState();
    if (!cropperState) return;
    const imageSize = getTransformedImageSize(cropperState);
    cropperRef.current.setCoordinates({
      ...imageSize,
      left: 0,
      top: 0,
    });
  };

  const getCropperStencilSize = (state: CropperState, _: DefaultSettings) => {
    const imageSize = getTransformedImageSize(state);

    return {
      width: (state.boundary.height * imageSize.width) / imageSize.height,
      height: state.boundary.height,
    };
  };

  useEventListener("resize", handleWindowResize);

  useImperativeHandle(apiRef, () => ({
    maximizeImage,
    rotateLeftImage,
    rotateRightImage,
    zoomInImage,
    zoomOutImage,
  }));

  useEffect(() => {
    return () => {
      clearTimeout(cropperResetTimeoutRef.current!);
    };
  }, []);

  return (
    <div className={classes.photo}>
      <FixedCropper
        ref={cropperRef}
        className={classes.photoCropper}
        src={src}
        stencilSize={getCropperStencilSize}
        minHeight={(1 / 3) * 100}
        stencilProps={{
          handlers: false,
          lines: false,
          movable: false,
          resizable: false,
          overlayClassName: classes.photoCropperOverlay,
        }}
        boundaryProps={{
          height: 600,
        }}
        transformImage={{
          adjustStencil: false,
        }}
        defaultSize={getCropperDefaultSize}
        imageRestriction={ImageRestriction.stencil}
      />
    </div>
  );
};

const VideoItem = (props: React.ComponentProps<typeof ReactPlayer>) => {
  const { className, ...rest } = props;

  const { classes, cx } = useStyles();

  return (
    <ReactPlayer
      width={"100%"}
      height={"100%"}
      // playsinline
      loop={true}
      playing
      {...rest}
      className={cx(classes.video, props.className)}
    />
  );
};

const YoutubeItem = (
  props: Omit<React.ComponentProps<typeof ReactPlayer>, "url"> & {
    url: string;
    playing?: boolean;
  }
) => {
  const { className, url, playing, ...rest } = props;

  const youtubeReactPlayerRef = useRef<any>();

  const { classes, cx } = useStyles();

  useEffect(() => {
    if (
      youtubeReactPlayerRef.current &&
      youtubeReactPlayerRef.current.getInternalPlayer()
    ) {
      if (!rest?.playing) {
        youtubeReactPlayerRef.current.getInternalPlayer().pauseVideo();
      } else {
        youtubeReactPlayerRef.current.getInternalPlayer().playVideo();
      }
    }
  }, [rest.playing]);

  return (
    <ReactPlayer
      ref={youtubeReactPlayerRef}
      width={"100%"}
      height={"100%"}
      playsinline
      config={{
        youtube: {
          playerVars: {
            autoplay: 1,
            frameborder: 0,
            controls: 1,
          },
        },
      }}
      className={cx(classes.youtube, className)}
      {...rest}
      url={commonHelpers.formatYoutubeUrl(url)}
    />
  );
};

const GalleryDialog = (props: GalleryDialogProps) => {
  const { items, selectedItemIndex, open, onClose } = props;

  const [thumbnailsSwiper, setThumbnailsSwiper] = useState<any>(null);
  const [swiperSlideIndex, setSwiperSlideIndex] = useState(
    selectedItemIndex ?? 0
  );

  const [shareDialogData, setShareDialogData] =
    useState<ShareDialogProps["data"]>();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const swiperScrollingRef = useRef(false);
  const photoItemApiRef = useRef<{
    [index: number]: PhotoItemApiRef;
  }>({});

  const id = useId();

  const { classes, theme, cx } = useStyles();

  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const thumbnailSwiperSlidesPerView = useMemo(() => {
    return isSmDown ? 5 : isMdDown ? 8 : 12;
  }, [isMdDown, isSmDown]);

  const mediaSwiperNavigationPrevElClassName = `swiper-button-prev-${id.replaceAll(
    ":",
    "app"
  )}`;
  const mediaSwiperNavigationNextElClassName = `swiper-button-next-${id.replaceAll(
    ":",
    "app"
  )}`;

  const isImageItem = items[swiperSlideIndex]?.type === "image";

  const handleSwiperBeforeSlideChangeStart: AppSwiperProps["onBeforeSlideChangeStart"] =
    (swiper) => {
      setSwiperSlideIndex(swiper.activeIndex);
    };

  const handleSwiperSlideChangeTransitionEnd = () => {
    swiperScrollingRef.current = false;
  };

  const handleSwiperSlideChangeTransitionStart = () => {
    swiperScrollingRef.current = true;
  };

  const handleImageMaximize = () => {
    if (swiperScrollingRef.current) return;
    photoItemApiRef.current[swiperSlideIndex].maximizeImage();
  };

  const handleImageRotateLeft = () => {
    if (swiperScrollingRef.current) return;
    photoItemApiRef.current[swiperSlideIndex].rotateLeftImage();
  };

  const handleImageRotateRight = () => {
    if (swiperScrollingRef.current) return;
    photoItemApiRef.current[swiperSlideIndex].rotateRightImage();
  };

  const handleImageZoomIn = () => {
    if (swiperScrollingRef.current) return;
    photoItemApiRef.current[swiperSlideIndex].zoomInImage();
  };

  const handleImageZoomOut = () => {
    if (swiperScrollingRef.current) return;
    photoItemApiRef.current[swiperSlideIndex].zoomOutImage();
  };

  const handleImageDownload = () => {
    const item = items[swiperSlideIndex];
    if (!item) return;
    if (["image", "video"].includes(item.type)) {
      commonHelpers.downloadFiles({
        src: item.src,
        name: item.title,
      });
    }
    if (item.type === "youtube") {
      window.open(item.src, "_blank");
    }
  };

  const handleShareDialogOpen = () => {
    const item = items[swiperSlideIndex];
    if (!item) return;
    setShareDialogOpen(true);
    setShareDialogData({
      url: item.src,
      title: item.title,
      ...item.shareData,
    });
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  useEffect(() => {
    // !open && setThumbnailsSwiper(null);
  }, [open]);

  useEffect(() => {
    if (!isMounted()) return;
    setSwiperSlideIndex(0);
  }, [items]);

  useEffect(() => {
    if (!isMounted()) return;
    setSwiperSlideIndex(selectedItemIndex ?? 0);
  }, [selectedItemIndex]);

  const isMounted = useIsMounted();

  return (
    <>
      <Dialog
        open={!!open}
        fullScreen
        classes={{
          paper: classes.dialogPaper,
        }}
        scroll="paper"
        onClose={onClose as any}
        sx={{
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <DialogContent className={classes.dialogContent}>
          <AppContainer maxWidth={false}>
            <div className={classes.mediaTitle}>
              {isMdDown && (
                <div
                  className={cx(
                    classes.mediaTitleToolbar,
                    classes.mediaTitleToolbarStart
                  )}
                >
                  <AppIconButton
                    edge={"xy"}
                    borderRadius="circular"
                    color="common.white"
                    onClick={onClose as any}
                  >
                    <AppSvgIcon component={CloseIcon} />
                  </AppIconButton>
                </div>
              )}
              <AppTypography
                variant="bodyMed16"
                align="center"
                className={classes.mediaTitlePrimary}
                component="div"
                noWrap
              >
                {items[swiperSlideIndex]?.title}
              </AppTypography>
              {items[swiperSlideIndex]?.subTitle && (
                <AppTypography
                  variant="captionReg12"
                  align="center"
                  className={classes.mediaTitleSecondary}
                  component="div"
                  color="common.neutral"
                  noWrap
                >
                  {items[swiperSlideIndex]?.subTitle}
                </AppTypography>
              )}
              <div
                className={cx(
                  classes.mediaTitleToolbar,
                  classes.mediaTitleToolbarEnd
                )}
              >
                <AppIconButton
                  edge={"xy"}
                  borderRadius="circular"
                  color="common.white"
                  onClick={handleImageDownload}
                >
                  <AppSvgIcon component={DownloadIcon} fontSize="inherit" />
                </AppIconButton>
                <AppIconButton
                  edge={"xy"}
                  borderRadius="circular"
                  color="common.white"
                  onClick={handleShareDialogOpen}
                >
                  <AppSvgIcon component={IosShareIcon} fontSize="inherit" />
                </AppIconButton>
                {!isMdDown && (
                  <AppIconButton
                    edge={"xy"}
                    borderRadius="circular"
                    color="common.white"
                    onClick={onClose as any}
                  >
                    <AppSvgIcon component={CloseIcon} fontSize="inherit" />
                  </AppIconButton>
                )}
              </div>
            </div>
          </AppContainer>
          <div className={classes.mediaContent}>
            {open && (
              <AppSwiper
                rootProps={{
                  className: classes.mediaSwiper,
                }}
                slidesPerView={1}
                navigation={{
                  enabled: true,
                  prevEl: `.${mediaSwiperNavigationPrevElClassName}`,
                  nextEl: `.${mediaSwiperNavigationNextElClassName}`,
                }}
                // virtual={{
                //   enabled: true,
                //   addSlidesBefore: 2,
                //   addSlidesAfter: 2,
                // }}
                allowTouchMove={false}
                initialSlide={selectedItemIndex ?? swiperSlideIndex}
                thumbs={{
                  swiper: !!thumbnailsSwiper?.destroyed
                    ? null
                    : thumbnailsSwiper,
                }}
                watchSlidesProgress
                onBeforeTransitionStart={handleSwiperBeforeSlideChangeStart}
                onSlideChangeTransitionEnd={
                  handleSwiperSlideChangeTransitionEnd
                }
                onSlideChangeTransitionStart={
                  handleSwiperSlideChangeTransitionStart
                }
              >
                {items.map((item, itemIndex) => (
                  <SwiperSlide className={classes.mediaItem} key={itemIndex}>
                    {({ isVisible }) => {
                      return (
                        <>
                          {item.type === "image" && (
                            <PhotoItem
                              src={item.src}
                              apiRef={(ref) =>
                                (photoItemApiRef.current[itemIndex] = ref!)
                              }
                            />
                          )}
                          {item.type === "video" && (
                            <VideoItem
                              url={item.src}
                              controls
                              playing={isVisible}
                            />
                          )}
                          {item.type === "youtube" && (
                            <YoutubeItem url={item.src} playing={isVisible} />
                          )}
                        </>
                      );
                    }}
                  </SwiperSlide>
                ))}
              </AppSwiper>
            )}
            <div
              className={cx(
                classes.photoToolbar,
                isImageItem && classes.active
              )}
            >
              <ButtonBase
                className={classes.photoToolbarButton}
                onClick={handleImageMaximize}
              >
                <AppSvgIcon component={MaximizeIcon} fontSize="inherit" />
              </ButtonBase>
              <ButtonBase
                className={classes.photoToolbarButton}
                onClick={handleImageRotateLeft}
              >
                <AppSvgIcon
                  component={Rotate90BoxLeftIcon}
                  fontSize="inherit"
                />
              </ButtonBase>
              <ButtonBase
                className={classes.photoToolbarButton}
                onClick={handleImageRotateRight}
              >
                <AppSvgIcon
                  component={Rotate90BoxRightIcon}
                  fontSize="inherit"
                />
              </ButtonBase>
              <ButtonBase
                className={classes.photoToolbarButton}
                onClick={handleImageZoomIn}
              >
                <AppSvgIcon component={ZoomInIcon} fontSize="inherit" />
              </ButtonBase>
              <ButtonBase
                className={classes.photoToolbarButton}
                onClick={handleImageZoomOut}
              >
                <AppSvgIcon component={ZoomOutIcon} fontSize="inherit" />
              </ButtonBase>
            </div>

            <ButtonBase
              className={cx(
                mediaSwiperNavigationPrevElClassName,
                classes.navigationArrow,
                classes.navigationArrowPrev,
                classes.navigationArrowButton,
                items.length < 2 && classes.hidden
              )}
            >
              <AppSvgIcon component={ArrowLeftIcon} fontSize="inherit" />
            </ButtonBase>
            <ButtonBase
              className={cx(
                mediaSwiperNavigationNextElClassName,
                classes.navigationArrow,
                classes.navigationArrowNext,
                classes.navigationArrowButton,
                items.length < 2 && classes.hidden
              )}
            >
              <AppSvgIcon component={ArrowRightIcon} fontSize="inherit" />
            </ButtonBase>
          </div>

          <div className={classes.thumbnail}>
            <AppContainer maxWidth="md" disableGutters>
              <div className={classes.thumbnailSwiper}>
                {open && (
                  <AppSwiper
                    spaceBetween={4}
                    slidesPerView={thumbnailSwiperSlidesPerView}
                    watchSlidesProgress
                    virtual={{
                      enabled: true,
                      addSlidesBefore: thumbnailSwiperSlidesPerView,
                      addSlidesAfter: thumbnailSwiperSlidesPerView,
                    }}
                    initialSlide={selectedItemIndex ?? swiperSlideIndex}
                    onSwiper={setThumbnailsSwiper}
                    onBeforeTransitionStart={handleSwiperBeforeSlideChangeStart}
                    onSlideChangeTransitionEnd={
                      handleSwiperSlideChangeTransitionEnd
                    }
                    onSlideChangeTransitionStart={
                      handleSwiperSlideChangeTransitionStart
                    }
                  >
                    {items.map((item, itemIndex) => (
                      <SwiperSlide key={itemIndex} virtualIndex={itemIndex}>
                        <div className={classes.thumbnailItem}>
                          {item.type === "image" && (
                            <AppImage
                              src={item.thumbnail || item.src}
                              fill
                              sizes={`(max-width: ${
                                theme.breakpoints.values.sm
                              }px) ${Math.round(100 / 5)}vw, (max-width: ${
                                theme.breakpoints.values.md
                              }px) ${Math.round(100 / 8)}vw, ${Math.round(
                                100 / 12
                              )}vw`}
                              objectFit="cover"
                              objectPosition="center"
                              defaultPlaceholderVariant="default"
                            />
                          )}
                          {item.type === "video" && (
                            <VideoItem
                              url={item.src}
                              light={item.thumbnail}
                              playIcon={
                                <AppSvgIcon
                                  component={PlayFilledSvg}
                                  sx={{ fontSize: 24 }}
                                />
                              }
                            />
                          )}
                          {item.type === "youtube" && (
                            <YoutubeItem
                              url={item.src}
                              light
                              playIcon={
                                <AppSvgIcon
                                  component={PlayFilledSvg}
                                  sx={{ fontSize: 24 }}
                                />
                              }
                            />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </AppSwiper>
                )}
              </div>
            </AppContainer>
          </div>
        </DialogContent>
      </Dialog>
      <ShareDialog
        open={shareDialogOpen}
        data={shareDialogData!}
        onClose={handleShareDialogClose}
      />
    </>
  );
};

export default GalleryDialog;
