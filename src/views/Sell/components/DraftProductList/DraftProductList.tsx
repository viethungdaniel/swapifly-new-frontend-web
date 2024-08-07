import axios from "axios";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import { alertDialogService, loadingScreenOverlayService } from "@/services";
import { storeProductAction } from "@/store";
import {
  axiosHelpers,
  commonHelpers,
  imageHelpers,
  reduxHelpers,
} from "@/utils/helpers";

import { Grid, Skeleton } from "@mui/material";
import AppTypography from "@/components/AppTypography";
import AppLink from "@/components/AppLink";
import AppImage from "@/components/AppImage";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTooltip from "@/components/AppTooltip";

import CancelIcon from "@@/public/images/icons/cancel.svg";

import { useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Trans, useTranslation } from "next-i18next";

import useStyles from "./DraftProductList.styles";

import type { CancelTokenSource } from "axios";

const DraftProductList = () => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  const deleteDraftProductSource = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_productAction = useMemo(
    () => bindActionCreators(storeProductAction, dispatch),
    [dispatch]
  );

  const $s_draftProducts = useAppSelector(
    (state) => state.product.draftProducts
  );
  const $s_draftProductsLoading = useAppSelector(
    (state) => state.product.draftProductsLoading
  );
  const $s_draftProductsError = useAppSelector(
    (state) => state.product.draftProductsError
  );

  const handleDraftProductDelete =
    (draftProduct: (typeof $s_draftProducts)[number]) =>
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { isConfirmed } = await alertDialogService.fire({
        title: t("deleteDraftConfirmationTitle"),
        content: (
          <Trans
            defaults="deleteDraftConfirmationContent"
            values={{
              productDraftTitle: draftProduct.title || "Untitled",
            }}
            components={{
              p1: <AppTypography variant="bodyMed14" component="span" />,
            }}
          />
        ),
      });
      if (!isConfirmed) return;
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      deleteDraftProductSource.current = axios.CancelToken.source();
      const response = await reduxHelpers.callActionWithPromise(
        $s_productAction.deleteDraftProductSaga,
        {
          params: {
            id: draftProduct.id,
          },
          cancelToken: deleteDraftProductSource.current.token,
        }
      );
      if (axiosHelpers.checkRequestSuccess(response)) {
        toast.success(t("deletedSuccessfully"));
      } else toast.error(response.message);
      loadingScreenOverlayService.close();
    };

  return (
    <div>
      <Grid container spacing={2.5}>
        {$s_draftProductsLoading || !!$s_draftProductsError ? (
          [...Array.from(Array(6)).keys()].map((key) => (
            <Grid key={key} item xs={4} tablet={12 / 6}>
              <div className={classes.draftProductItem}>
                <div className={classes.draftProductItemThumbnail}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <AppTypography>
                  <Skeleton variant="text" />
                </AppTypography>
              </div>
            </Grid>
          ))
        ) : $s_draftProducts.length < 1 ? (
          <Grid item xs={12}>
            <AppTypography color="text.secondary">
              {t("youDontHaveAnySavedDrafts")}
            </AppTypography>
          </Grid>
        ) : (
          $s_draftProducts.map((draftProduct, draftProductIndex) => (
            <Grid key={draftProductIndex} item xs={4} tablet={12 / 6}>
              <AppLink
                className={classes.draftProductItem}
                href={`/sell/new-item?item_draft=${commonHelpers.generateProductSlug(
                  draftProduct.title || "Untitled",
                  draftProduct.id
                )}`}
                underline="none"
              >
                <AppTooltip title={t("delete")}>
                  <AppIconButton
                    variant="text"
                    color="text.primary"
                    edge="xy"
                    borderRadius="circular"
                    className={classes.draftProductItemRemoveButton}
                    onClick={handleDraftProductDelete(draftProduct)}
                  >
                    <AppSvgIcon
                      component={CancelIcon}
                      fontSize="inherit"
                      sx={{ pointerEvents: "none" }}
                    />
                  </AppIconButton>
                </AppTooltip>
                <div className={classes.draftProductItemThumbnail}>
                  <AppImage
                    src={draftProduct.images[1] || draftProduct.images[0]}
                    loader={imageHelpers.appImageLoader}
                    fill
                    alt={draftProduct.title || "Untitled"}
                    objectFit="cover"
                    objectPosition="center"
                  />
                  <AppTypography className={classes.draftProductItemTag}>
                    {t("draft")}
                  </AppTypography>
                </div>
                <AppTypography className={classes.draftProductItemTitle}>
                  {draftProduct.title || t("untitled")}
                </AppTypography>
              </AppLink>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default DraftProductList;
