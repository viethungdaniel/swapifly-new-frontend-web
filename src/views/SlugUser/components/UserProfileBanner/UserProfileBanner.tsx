import axios from "axios";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";

import {
  axiosHelpers,
  imageHelpers,
  reduxHelpers,
  userHelpers,
} from "@/utils/helpers";
import { alertDialogService, loadingScreenOverlayService } from "@/services";
import { commonApi } from "@/utils/apis";
import { storeAuthAction } from "@/store";

import {
  IMAGE_FILE_MAX_SIZE,
  imageExtensions,
} from "@/utils/constants/common.constants";

import AppImage from "@/components/AppImage";
import AppPosition from "@/components/AppPosition";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import CameraIcon from "@@/public/images/icons/camera.svg";

import { useAppDispatch, useAppSelector } from "@/hooks";

import { useMemo, useRef, useState } from "react";

import GalleryDialog from "@/components/GalleryDialog";

import { useTranslation } from "next-i18next";

import useStyles from "./UserProfileBanner.styles";

import type { CancelTokenSource } from "axios";
import type { GalleryDialogProps } from "@/components/GalleryDialog";

const PhotoButton = () => {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadFileSourceRef = useRef<CancelTokenSource | null>(null);
  const updateAuthUserBannerSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const file = Array.from(event.target.files!)[0];
    event.target.value = "";

    const fileExtension = `.${file.name.split(".").reverse()[0]}`.toLowerCase();

    if (file.size > IMAGE_FILE_MAX_SIZE) {
      toast.error(
        t("uploadedFileMaxSizeErrorMessage", {
          count: 1,
          fileName: file.name,
          fileMaxSize: IMAGE_FILE_MAX_SIZE / 1000000,
        })
      );
      return;
    }
    if (!(imageExtensions as unknown as string).includes(fileExtension)) {
      toast.error(
        t("invalidObjectMessage", {
          count: 1,
          object: file.name,
        })
      );
    }
    const { isConfirmed } = await alertDialogService.fire({
      title: t("changeBannerConfirmationTitle"),
      content: t("changeBannerConfirmationContent"),
    });
    if (!isConfirmed) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);
    uploadFileSourceRef.current = axios.CancelToken.source();
    try {
      const { data: response } = await commonApi.uploadFile({
        params: {
          file,
          type: "image",
        },
        cancelToken: uploadFileSourceRef.current.token,
      });
      if (axiosHelpers.checkRequestSuccess(response)) {
        uploadFileSourceRef.current = null;
        updateAuthUserBannerSourceRef.current = axios.CancelToken.source();
        const _response = await reduxHelpers.callActionWithPromise(
          $s_authAction.updateUserMediaSaga,
          {
            params: {
              banner: response.data,
            },
            cancelToken: updateAuthUserBannerSourceRef.current.token,
          }
        );
        if (axiosHelpers.checkRequestSuccess(_response)) {
          toast.success(t("updatedBannerSuccessfully"));
        } else {
          toast.error(_response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "";
      toast.error(message);
    }
    loadingScreenOverlayService.close();
  };

  const handleCameraButtonClick = () => {
    fileInputRef.current?.click && fileInputRef.current.click();
  };

  return (
    <>
      <AppIconButton
        borderRadius="circular"
        variant="contained"
        color="common.white"
        onClick={handleCameraButtonClick}
      >
        <AppSvgIcon component={CameraIcon} fontSize="inherit" />
      </AppIconButton>
      <input
        ref={fileInputRef}
        type="file"
        accept={imageExtensions.join(", ")}
        style={{
          display: "none",
        }}
        onChange={handleFileInputChange}
      />
    </>
  );
};

const UserProfileBanner = () => {
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [galleryDialogItems, setGalleryDialogItems] = useState<
    GalleryDialogProps["items"]
  >([]);

  const { classes, theme, cx } = useStyles();

  const { t } = useTranslation();

  const defaultProfileBannerImg =
    imageHelpers.generateEncodedCustomReversedLogoSvg({
      bgFill: theme.palette.primary.main,
      arrow1Fill: theme.palette.common.lightPink,
      arrow2Fill: theme.palette.common.blue,
    });

  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_userBanner = useAppSelector(
    (state) => state.user.user?.shop?.banner
  );
  const $s_userNickname = useAppSelector(
    (state) => state.user.user?.shop?.nickname
  );
  const $s_authUserShopNumber = useAppSelector(
    (state) => state.auth.user?.shop
  );
  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);

  const isAuthUserMerchant = userHelpers.isMerchant($s_authUserShopNumber);

  const handleGalleryDialogOpen = () => {
    if (!$s_userBanner) return;
    setGalleryDialogOpen(true);
    setGalleryDialogItems([
      {
        src: imageHelpers.imagePathLoader($s_userBanner),
        title: $s_userNickname ?? "",
        type: "image",
        thumbnail: imageHelpers.imagePathLoader($s_userBanner),
      },
    ]);
  };

  const handleGalleryDialogClose = () => {
    setGalleryDialogOpen(false);
  };

  return (
    <>
      <div className={classes.banner}>
        <AppImage
          className={cx(
            classes.bannerImage,
            !!$s_userBanner && classes.hasBanner
          )}
          src={!!$s_userBanner ? $s_userBanner : defaultProfileBannerImg}
          loader={imageHelpers.imageLoader}
          alt={`${$s_userNickname} - ${t("profileBanner")}`}
          defaultImgSrc={defaultProfileBannerImg}
          fill
          sizes="100vw"
          objectFit="cover"
          objectPosition="center"
          onClick={handleGalleryDialogOpen}
        />
        {$s_authUserId === $s_userId && isAuthUserMerchant && (
          <AppPosition
            placement="bottom-end"
            position="absolute"
            gutter="medium"
          >
            <PhotoButton />
          </AppPosition>
        )}
      </div>
      <GalleryDialog
        open={galleryDialogOpen}
        items={galleryDialogItems}
        onClose={handleGalleryDialogClose}
      />
    </>
  );
};

export default UserProfileBanner;
