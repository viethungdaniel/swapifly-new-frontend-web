import { v4 as uuidv4 } from "uuid";
import _isEqual from "lodash/isEqual";
import { toast } from "react-toastify";
import axios from "axios";
import { bindActionCreators } from "redux";

import { storeProductAction } from "@/store";
import { alertDialogService, loadingScreenOverlayService } from "@/services";
import { productApi } from "@/utils/apis";
import {
  axiosHelpers,
  commonHelpers,
  imageHelpers,
  userHelpers,
} from "@/utils/helpers";
import { commonConstants, productConstants } from "@/utils/constants";

import AppContainer from "@/components/AppContainer";
import SaleProductFormik from "@/containers/SaleProductFormik";
import AppContent from "@/components/AppContent";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppTypography from "@/components/AppTypography";
import AppLink from "@/components/AppLink";

import { useFormikContext } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useOnLeavePageConfirmation,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import type { FormikProps } from "formik";
import type { CancelTokenSource } from "axios";
import type { SaleProductFormValues } from "@/containers/SaleProductFormik";

const LeavePageConfirmation = () => {
  const { values, initialValues } = useFormikContext<SaleProductFormValues>();

  const { t } = useTranslation();

  const $s_draftProduct = useAppSelector((state) => state.product.draftProduct);
  const $s_authUserShopId = useAppSelector((state) => state.auth.user?.shop);
  const $s_draftProductId = useAppSelector(
    (state) => state.product.draftProduct?.id
  );
  const isAuthUserMerchant = userHelpers.isMerchant($s_authUserShopId);

  useOnLeavePageConfirmation({
    shouldConfirmLeave:
      !_isEqual(values, initialValues) ||
      (!!$s_draftProduct && !$s_draftProduct?.id),
    message: t("askSaveDraftBeforeLeavePage"),
    alertDialogServiceOptions: {
      actions: [
        {
          children: t("cancel"),
          name: "CANCEL",
          buttonProps: {
            color: "text.primary",
            variant: "outlined",
          },
        },
        {
          children: t("no"),
          name: "NO",
          isConfirmAction: true,
          buttonProps: {
            color: "text.primary",
            variant: "outlined",
          },
        },
        {
          children: t("yes"),
          name: "YES",
          isConfirmAction: true,
          buttonProps: {
            color: "text.primary",
            variant: "contained",
          },
        },
      ],
    },
    alertDialogServiceBeforeFire: async () => {
      if (values.images.uploading || values.video.uploading) {
        toast.info(t("uploadingFileInfoMessage"));
        return false;
      }
    },
    routeBeforeChange: async ({ alertDialogServiceFireResponse }) => {
      const { name } = alertDialogServiceFireResponse;
      if (name === "YES") {
        loadingScreenOverlayService.fire(`${t("saving")}...`);
        try {
          const typeToChatDaysMap: { [key: string]: any[] } = {
            [productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION]:
              values.chat_days,
            [productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION]:
              values.chat_weekdays,
            [productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION]: [],
          };
          const params = {
            youtube_link: values.youtube_link!,
            videos: !!values.video.file?.value
              ? ([values.video.file.value!] as string[])
              : [],
            video_thumbnails: !!values.video.file?.thumbnailPath
              ? ([values.video.file.thumbnailPath!] as string[])
              : [],
            currency: values.region?.currency!,
            images: values.images.files.map((file) => file.value!),
            rid: values.product_category?.id!,
            title: values.title,
            brand_id: values.brand?.id!,
            nid: values.product_condition?.id!,
            region: values.region?.id!,
            price: values.price,
            describe: values.describe,
            ...(isAuthUserMerchant
              ? {
                  chat_auto_reply: values.chat_auto_reply,
                  chat_time_type: values.chat_time_type,
                  chat_days: typeToChatDaysMap[values.chat_time_type] ?? [],
                  chat_time_from:
                    values.chat_time_type ===
                    productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION
                      ? ""
                      : values.chat_time_from,
                  chat_time_to:
                    values.chat_time_type ===
                    productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION
                      ? ""
                      : values.chat_time_to,
                  chat_ai_style:
                    values.chat_time_type ===
                    productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION
                      ? ""
                      : values.chat_ai_style?.id!,
                }
              : {}),
            offline: values.offline,
            offline_address: !!values.offline ? values.offline_address : [],
            mail: values.mail,
            mail_note: !!values.mail ? values.mail_note : "",
          };
          if (!$s_draftProductId)
            await productApi.addDraftProduct({
              params,
            });
          else
            await productApi.updateDraftProduct({
              params: {
                ...params,
                id: $s_draftProductId!,
              },
            });
        } catch {}
      }
    },
  });

  return null;
};

const SellNewItem = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_draftProduct = useAppSelector((state) => state.product.draftProduct);
  const $s_authUserShopId = useAppSelector((state) => state.auth.user?.shop);

  const isAuthUserMerchant = userHelpers.isMerchant($s_authUserShopId);

  const router = useRouter();

  const addProductSourceRef = useRef<CancelTokenSource | null>(null);
  const formikRef = useRef<FormikProps<SaleProductFormValues>>(null!);
  const submitSucceedRef = useRef(false);

  const initialValues = useMemo<SaleProductFormValues>(() => {
    const video = $s_draftProduct?.videos?.[0] ?? "";
    const videoThumbnail = $s_draftProduct?.video_thumbnails?.[0] ?? "";
    const videoFileName = video.split("/").reverse()[0];
    let videoFileExtension = `.${videoFileName.split(".").reverse()[0]}`;
    videoFileExtension = commonConstants.videoExtensions.includes(
      videoFileExtension as any
    )
      ? videoFileExtension
      : commonConstants.videoExtensions[0];
    const productChatTimeType =
      $s_draftProduct?.chat_time_type ||
      productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION;
    const productCategory = $s_draftProduct?.category;

    return {
      youtube_link: $s_draftProduct?.youtube_link ?? "",
      images: {
        files: Array.isArray($s_draftProduct?.images)
          ? ($s_draftProduct?.images
              .filter((img) => typeof img === "string")
              .map((image) => {
                const fileName = image.split("/").reverse()[0];
                const fileExtension = `.${fileName.split(".").reverse()[0]}`;
                return {
                  name: image.split("/").reverse()[0],
                  extension: commonConstants.imageExtensions.includes(
                    fileExtension as any
                  )
                    ? fileExtension
                    : commonConstants.imageExtensions[0],
                  thumbnail: imageHelpers.imagePathLoader(image),
                  uploading: false,
                  uuid: uuidv4(),
                  value: image,
                };
              }) as SaleProductFormValues["images"]["files"])
          : [],
        uploading: false,
      },
      video: {
        file: !!video
          ? {
              name: videoFileName,
              extension: videoFileExtension,
              thumbnail: imageHelpers.imagePathLoader(videoThumbnail),
              thumbnailPath: videoThumbnail,
              uploading: false,
              uuid: uuidv4(),
              value: video,
            }
          : null,
        uploading: false,
      },
      product_category: productCategory ?? null,
      title: $s_draftProduct?.title ?? "",
      brand: $s_draftProduct?.brand ?? null,
      product_condition: $s_draftProduct?.condition_item ?? null,
      region: $s_draftProduct?.region_obj ?? null,
      price: $s_draftProduct?.price_origin ?? "",
      describe: $s_draftProduct?.describe ?? "",
      chat_auto_reply: $s_draftProduct?.chat_auto_reply ?? 0,
      chat_time_type: productChatTimeType,
      chat_days:
        productChatTimeType ===
        productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION
          ? ($s_draftProduct?.chat_days as string[]) ?? []
          : [],
      chat_weekdays:
        productChatTimeType ===
        productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION
          ? ($s_draftProduct?.chat_days as number[]) ?? []
          : [],
      chat_time_from: $s_draftProduct?.chat_time_from ?? "",
      chat_time_to: $s_draftProduct?.chat_time_to ?? "",
      chat_ai_style: $s_draftProduct?.chat_ai_style_item ?? null,
      offline: $s_draftProduct?.offline ?? 0,
      offline_address: $s_draftProduct?.offline_address ?? [],
      mail: $s_draftProduct?.mail ?? 0,
      mail_note: $s_draftProduct?.mail_note ?? "",
    };
  }, [$s_draftProduct]);

  const handleSubmit = async (values: SaleProductFormValues) => {
    if (values.images.uploading || values.video.uploading) {
      toast.info(t("uploadingFileInfoMessage"));
      return;
    }

    const { isConfirmed } = await alertDialogService.fire({
      title: t("savedNewProductConfirmationTitle"),
      content: t("savedNewProductConfirmationContent"),
    });
    if (!isConfirmed) return;

    addProductSourceRef.current = axios.CancelToken.source();
    loadingScreenOverlayService.fire(`${t("saving")}...`);
    try {
      const typeToChatDaysMap: { [key: string]: any[] } = {
        [productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION]:
          values.chat_days,
        [productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION]:
          values.chat_weekdays,
        [productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION]: [],
      };
      const { data: response } = await productApi.addProduct({
        params: {
          youtube_link: values.youtube_link!,
          videos: !!values.video.file?.value
            ? ([values.video.file.value!] as string[])
            : [],
          video_thumbnails: !!values.video.file?.thumbnailPath
            ? ([values.video.file.thumbnailPath!] as string[])
            : [],
          currency: values.region?.currency!,
          images: values.images.files
            .map((file) => file.value!)
            .filter((file) => !!file),
          rid: values.product_category?.id!,
          title: values.title,
          brand_id: values.brand?.id!,
          nid: values.product_condition?.id!,
          region: values.region?.id!,
          price: values.price,
          describe: values.describe,
          ...(isAuthUserMerchant
            ? {
                chat_auto_reply: values.chat_auto_reply,
                chat_time_type: values.chat_time_type,
                chat_days: typeToChatDaysMap[values.chat_time_type] ?? [],
                chat_time_from:
                  values.chat_time_type ===
                  productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION
                    ? ""
                    : values.chat_time_from,
                chat_time_to:
                  values.chat_time_type ===
                  productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION
                    ? ""
                    : values.chat_time_to,
                chat_ai_style:
                  values.chat_time_type ===
                  productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION
                    ? ""
                    : values.chat_ai_style?.id!,
              }
            : {}),
          offline: values.offline,
          offline_address: !!values.offline ? values.offline_address : [],
          mail: values.mail,
          mail_note: !!values.mail ? values.mail_note : "",
        },
        cancelToken: addProductSourceRef.current.token,
      });
      if (axiosHelpers.checkRequestSuccess(response)) {
        submitSucceedRef.current = true;
        formikRef.current.resetForm({
          values,
          touched: {},
          errors: {},
          submitCount: 0,
        });
        $s_productAction.setDraftProduct(null);
        await commonHelpers.sleep(150);
        router.push(
          `/${commonHelpers.generateProductSlug(
            response.data.title,
            response.data.id
          )}`
        );
      } else {
        toast.error(response.message);
        loadingScreenOverlayService.close();
      }
    } catch (error) {
      loadingScreenOverlayService.close();
      if (axios.isCancel(error)) return;
      const message = axiosHelpers.getErrorMessage(error);
      toast.error(message);
    }
  };

  useEffect(() => {
    return () => {
      if (submitSucceedRef.current) {
        toast.success(t("postedSuccessfully"));
      }
      loadingScreenOverlayService.close();
    };
  }, [t]);

  return (
    <div>
      <AppContainer>
        <AppContent>
          <AppBreadcrumbs sx={{ mb: 2.5 }}>
            <AppLink href="/sell" color="text.secondary">
              {t("sell")}
            </AppLink>
            <AppTypography color="text.primary">{t("newItem")}</AppTypography>
          </AppBreadcrumbs>
          <AppTypography variant="titleSemi20" mb={2.5}>
            {t("whatWouldYouLikeToSellToday")}
          </AppTypography>
          <SaleProductFormik
            formikRef={formikRef}
            beforeFormNode={<LeavePageConfirmation />}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
        </AppContent>
      </AppContainer>
    </div>
  );
};

export default SellNewItem;
