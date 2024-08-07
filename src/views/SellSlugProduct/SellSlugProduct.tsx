import { v4 as uuidv4 } from "uuid";
import _isEqual from "lodash/isEqual";
import axios from "axios";
import { toast } from "react-toastify";

import {
  axiosHelpers,
  commonHelpers,
  imageHelpers,
  userHelpers,
} from "@/utils/helpers";
import { alertDialogService, loadingScreenOverlayService } from "@/services";
import { productApi } from "@/utils/apis";
import { commonConstants, productConstants } from "@/utils/constants";

import AppContainer from "@/components/AppContainer";
import SaleProductFormik from "@/containers/SaleProductFormik";
import AppContent from "@/components/AppContent";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppTypography from "@/components/AppTypography";
import AppLink from "@/components/AppLink";

import { useFormikContext } from "formik";
import { useRouter } from "next/router";
import { useAppSelector, useOnLeavePageConfirmation } from "@/hooks";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";

import type { CancelTokenSource } from "axios";
import type { SaleProductFormValues } from "@/containers/SaleProductFormik";
import type { FormikProps } from "formik";

const LeavePageConfirmation = () => {
  const { values, initialValues } = useFormikContext<SaleProductFormValues>();

  useOnLeavePageConfirmation({
    shouldConfirmLeave: !_isEqual(values, initialValues),
  });

  return null;
};

const SellSlugProduct = () => {
  const $s_product = useAppSelector((state) => state.product.product);
  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_authUserShopId = useAppSelector((state) => state.auth.user?.shop);

  const isAuthUserMerchant = userHelpers.isMerchant($s_authUserShopId);

  const router = useRouter();

  const { t } = useTranslation();

  const updateProductSourceRef = useRef<CancelTokenSource | null>(null);
  const formikRef = useRef<FormikProps<SaleProductFormValues>>(null!);
  const submitSucceedRef = useRef(false);

  const initialValues = useMemo<SaleProductFormValues>(() => {
    const video = $s_product?.product?.videos_obj?.[0]?.video ?? "";
    const videoThumbnail =
      $s_product?.product?.videos_obj?.[0]?.thumbnail ?? "";
    const videoFileName = video.split("/").reverse()[0];
    let videoFileExtension = `.${videoFileName.split(".").reverse()[0]}`;
    videoFileExtension = commonConstants.videoExtensions.includes(
      videoFileExtension as any
    )
      ? videoFileExtension
      : commonConstants.videoExtensions[0];
    const productChatTimeType =
      $s_product?.product?.chat_time_type ||
      productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION;
    const productCategory = (
      Array.isArray($s_product?.product?.rid)
        ? [...$s_product!.product!.rid]
        : []
    ).reverse()[0];

    return {
      id: $s_product?.product?.id,
      youtube_link: $s_product?.product?.youtube_link ?? "",
      images: {
        files: Array.isArray($s_product?.product?.images)
          ? ($s_product
              ?.product!.images.filter((img) => typeof img === "string")
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
      title: $s_product?.product?.title ?? "",
      brand: $s_product?.brand ?? null,
      product_condition: $s_product?.condition_item ?? null,
      region: $s_product?.product?.region_obj ?? null,
      price: $s_product?.product?.price_origin ?? "",
      describe: $s_product?.product?.describe ?? "",
      chat_auto_reply: $s_product?.product?.chat_auto_reply ?? 0,
      chat_time_type: productChatTimeType,
      chat_days:
        productChatTimeType ===
        productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION
          ? ($s_product?.product?.chat_days as string[]) ?? []
          : [],
      chat_weekdays:
        productChatTimeType ===
        productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION
          ? ($s_product?.product?.chat_days as number[]) ?? []
          : [],
      chat_time_from: $s_product?.product?.chat_time_from ?? "",
      chat_time_to: $s_product?.product?.chat_time_to ?? "",
      chat_ai_style: $s_product?.product?.chat_ai_style_item ?? null,
      offline: $s_product?.product?.offline ?? 0,
      offline_address: $s_product?.product?.offline_address ?? [],
      mail: $s_product?.product?.mail ?? 0,
      mail_note: $s_product?.product?.mail_note ?? "",
    };
  }, [$s_product]);

  const handleSubmit = async (values: SaleProductFormValues) => {
    if (values.images.uploading || values.video.uploading) {
      toast.info(t("uploadingFileInfoMessage"));
      return;
    }

    const { isConfirmed } = await alertDialogService.fire({
      title: t("updatedNewProductConfirmationTitle"),
      content: t("updatedNewProductConfirmationContent"),
    });
    if (!isConfirmed) return;

    updateProductSourceRef.current = axios.CancelToken.source();
    loadingScreenOverlayService.fire(`${t("saving")}...`);
    try {
      const typeToChatDaysMap: { [key: string]: any[] } = {
        [productConstants.AUTO_REPLY_DATE_TIME_SPECIFY_DAY_TIME_OPTION]:
          values.chat_days,
        [productConstants.AUTO_REPLY_DATE_TIME_WEEKDAY_TIME_OPTION]:
          values.chat_weekdays,
        [productConstants.AUTO_REPLY_DATE_TIME_ANYTIME_OPTION]: [],
      };
      const { data: response } = await productApi.updateProduct({
        params: {
          id: values.id!,
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
        cancelToken: updateProductSourceRef.current.token,
      });
      if (axiosHelpers.checkRequestSuccess(response)) {
        submitSucceedRef.current = true;
        formikRef.current.resetForm({
          values,
          touched: {},
          errors: {},
          submitCount: 0,
        });
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
    if ($s_authUserId !== $s_product?.seller?.id) router.push("/404");

    return () => {
      if (submitSucceedRef.current) {
        toast.success(t("savedSuccessfully"));
      }
      loadingScreenOverlayService.close();
    };
  }, [t]);

  if ($s_authUserId !== $s_product?.seller?.id) return null;

  return (
    <div>
      <AppContainer>
        <AppContent>
          <AppBreadcrumbs sx={{ mb: 2.5 }}>
            <AppLink href="/sell" color="text.secondary">
              {t("sell")}
            </AppLink>
            <AppTypography color="text.primary">{t("editItem")}</AppTypography>
          </AppBreadcrumbs>
          <AppTypography variant="titleSemi20" mb={2.5}>
            {$s_product?.product?.title}
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

export default SellSlugProduct;
