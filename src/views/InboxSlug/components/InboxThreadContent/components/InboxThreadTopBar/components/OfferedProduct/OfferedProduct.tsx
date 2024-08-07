import { storeInboxSelectors } from "@/store";
import {
  commonHelpers,
  imageHelpers,
  inboxHelpers,
  productHelpers,
} from "@/utils/helpers";

import { Grid } from "@mui/material";
import AppImage from "@/components/AppImage";
import AppTypography from "@/components/AppTypography";
import AppToolbar from "@/components/AppToolbar";
import AppButton from "@/components/AppButton";
import SoldProductMarkButton from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadTopBar/components/OfferedProduct/components/SoldProductMarkButton";

import { useContext } from "react";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

import useStyles from "./OfferedProduct.styles";
import AppLink from "@/components/AppLink";

const OfferActions = () => {
  const {
    openOfferCreateFormModal,
    openOfferUpdateFormModal,
    openInboxThreadReviewsFormDialog,
    cancelInboxOffer,
    acceptInboxOffer,
    declineInboxOffer,
  } = useContext(InboxSlugContext);

  const { t } = useTranslation();

  const $s_inboxThreadOfferStateItem = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferStateItem
  );
  const $s_inboxThreadOfferUser = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferUser
  );
  const isAuthUserSellerRole = !!$s_inboxThreadOfferUser?.is_buyer;
  const isInboxThreadOfferNormalOfferStatus =
    inboxHelpers.isInboxThreadOfferNormalOfferStatus(
      $s_inboxThreadOfferStateItem?.status
    );
  const isInboxThreadOfferCreatedOfferStatus =
    inboxHelpers.isInboxThreadOfferCreatedOfferStatus(
      $s_inboxThreadOfferStateItem?.status
    );
  const isInboxThreadOfferAcceptedOfferStatus =
    inboxHelpers.isInboxThreadOfferAcceptedOfferStatus(
      $s_inboxThreadOfferStateItem?.status
    );
  const isInboxThreadOfferDeclinedOfferStatus =
    inboxHelpers.isInboxThreadOfferDeclinedOfferStatus(
      $s_inboxThreadOfferStateItem?.status
    );
  const $s_inboxThreadOfferReviewed = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferReviewed
  );

  const { classes } = useStyles();

  return (
    <>
      {isInboxThreadOfferNormalOfferStatus && !isAuthUserSellerRole && (
        <div className={classes.productActions}>
          <AppButton
            variant="contained"
            color="primary"
            onClick={openOfferCreateFormModal}
          >
            {t("offer")}
          </AppButton>
        </div>
      )}
      {isInboxThreadOfferCreatedOfferStatus && (
        <>
          {isAuthUserSellerRole ? (
            <>
              <AppTypography className={classes.productOfferStatus}>
                {t("offeredYouPrice", {
                  currency: $s_inboxThreadOfferStateItem?.currency,
                  price: $s_inboxThreadOfferStateItem?.price_origin,
                })}
              </AppTypography>
              <div className={classes.productActions}>
                <AppButton
                  variant="contained"
                  color="primary"
                  onClick={acceptInboxOffer}
                >
                  {t("accept")}
                </AppButton>
                <AppButton
                  variant="contained"
                  color="text.primary"
                  onClick={declineInboxOffer}
                >
                  {t("decline")}
                </AppButton>
              </div>
            </>
          ) : (
            <>
              <AppTypography className={classes.productOfferStatus}>
                {t("madeOfferPrice", {
                  currency: $s_inboxThreadOfferStateItem?.currency,
                  price: $s_inboxThreadOfferStateItem?.price_origin,
                })}
              </AppTypography>
              <div className={classes.productActions}>
                <AppButton
                  variant="contained"
                  color="primary"
                  onClick={openOfferUpdateFormModal}
                >
                  {t("editOffer")}
                </AppButton>
                <AppButton
                  variant="contained"
                  color="text.primary"
                  onClick={cancelInboxOffer}
                >
                  {t("cancel")}
                </AppButton>
              </div>
            </>
          )}
        </>
      )}
      {isInboxThreadOfferAcceptedOfferStatus && (
        <>
          <AppTypography
            className={classes.productOfferStatus}
            color="success.main"
          >
            {t("offerHasBeenAccepted")}
          </AppTypography>
          <div className={classes.productActions}>
            {isAuthUserSellerRole && <SoldProductMarkButton />}
            <AppButton
              disabled={$s_inboxThreadOfferReviewed}
              variant="contained"
              color="text.primary"
              noWrap
              onClick={openInboxThreadReviewsFormDialog}
            >
              {t($s_inboxThreadOfferReviewed ? "reviewed" : "reviews")}
            </AppButton>
          </div>
        </>
      )}
      {isInboxThreadOfferDeclinedOfferStatus && !isAuthUserSellerRole && (
        <>
          <AppTypography
            className={classes.productOfferStatus}
            color="error.main"
          >
            {t("offerHasBeenDeclined")}
          </AppTypography>
          <div className={classes.productActions}>
            <AppButton
              variant="contained"
              color="primary"
              onClick={openOfferCreateFormModal}
            >
              {t("offer")}
            </AppButton>
          </div>
        </>
      )}
    </>
  );
};

const OfferedProduct = () => {
  const { classes } = useStyles();

  const $s_inboxThreadOfferProduct = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferProduct
  );

  const isMarkedProductSold = productHelpers.isSoldProduct(
    $s_inboxThreadOfferProduct?.state
  );

  const $s_inboxThreadBlocked = useAppSelector(
    storeInboxSelectors.selectInboxThreadAuthBlocked
  );

  return (
    <AppToolbar className={classes.root}>
      <Grid container columnSpacing={2.5} rowSpacing={1.25} alignItems="center">
        <Grid
          item
          xs
          tablet
          sx={{
            overflow: "clip",
          }}
        >
          <div className={classes.productItem}>
            <AppLink
              href={`/${commonHelpers.generateProductSlug(
                $s_inboxThreadOfferProduct?.name!,
                $s_inboxThreadOfferProduct?.id!
              )}`}
              underline="none"
              hoverColor="none"
              display="flex"
              className={classes.productItemImage}
            >
              <AppImage
                src={$s_inboxThreadOfferProduct?.image}
                loader={imageHelpers.appImageLoader}
                fill
                objectFit="cover"
                objectPosition="center"
              />
              {isMarkedProductSold && (
                <AppTypography
                  variant="captionReg10"
                  className={classes.productItemSoldTag}
                >
                  Sold
                </AppTypography>
              )}
            </AppLink>
            <div className={classes.productItemContent}>
              <AppLink
                href={`/${commonHelpers.generateProductSlug(
                  $s_inboxThreadOfferProduct?.name!,
                  $s_inboxThreadOfferProduct?.id!
                )}`}
                underline="none"
                noWrap
                title={$s_inboxThreadOfferProduct?.name}
              >
                {$s_inboxThreadOfferProduct?.name}
              </AppLink>
              <AppTypography variant="bodySemi16">
                {$s_inboxThreadOfferProduct?.currency}{" "}
                {commonHelpers.formatNumber(
                  $s_inboxThreadOfferProduct?.price_origin
                )}
              </AppTypography>
            </div>
          </div>
        </Grid>
        {!$s_inboxThreadBlocked && (
          <Grid item xs={12} tablet="auto">
            <OfferActions />
          </Grid>
        )}
      </Grid>
    </AppToolbar>
  );
};

export default OfferedProduct;
