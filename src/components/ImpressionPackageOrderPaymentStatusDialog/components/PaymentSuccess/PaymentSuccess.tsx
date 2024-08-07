import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppDialogActions from "@/components/AppDialogActions";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";
import ProductCard from "@/containers/ProductCard";
import LoadingOverlay from "@/components/LoadingOverlay";

import RadioButtonCheckedIcon from "@@/public/images/icons/radio-button-checked.svg";

import { useContext } from "react";
import { useMediaQuery } from "@mui/material";
import { Trans, useTranslation } from "next-i18next";

import ImpressionPackageOrderPaymentStatusDialogContext from "@/components/ImpressionPackageOrderPaymentStatusDialog/ImpressionPackageOrderPaymentStatusDialog.context";

import useStyles from "./PaymentSuccess.styles";

const PaymentSuccess = () => {
  const {
    product,
    productError,
    productLoading,
    closeImpressionPackageOrderPaymentStatusDialog,
  } = useContext(ImpressionPackageOrderPaymentStatusDialogContext);

  const isLoading = productLoading || !!productError;

  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <>
      <AppDialogTitle
        onCloseButtonClick={closeImpressionPackageOrderPaymentStatusDialog}
      />
      <AppDialogContent>
        <LoadingOverlay loading={isLoading}>
          <div className={classes.content}>
            <div className={classes.product}>
              <ProductCard
                product={{
                  id: product?.product?.id,
                  title: product?.product?.title,
                  bookmark: !!product?.bookmark,
                  purchase_enable: product?.product.purchase_enable,
                  state: product?.product?.state,
                  videos: product?.product?.videos,
                  youtube_link: product?.product?.youtube_link,
                  islike: product?.product.islike,
                  image: product?.product?.image,
                  condition: product?.product?.condition,
                  currency: product?.product?.currency,
                  price: product?.product?.price,
                  nickname: product?.seller?.nickname,
                  avatar: product?.product?.image,
                  hot_pick: 1,
                }}
                variant="filled"
                boxShadowVariant="card"
              />
            </div>
            <AppSvgIcon
              component={RadioButtonCheckedIcon}
              color="success.main"
              fontSize="small"
              sx={{ mb: 0.5 }}
            />
            <AppTypography variant="bodyMed18" align="center" mb={0.5}>
              {t("succeededImpressionPackageOrderPaymentTitle")}
            </AppTypography>
            <AppTypography
              color="text.secondary"
              whiteSpace="pre-wrap"
              align="center"
              mb={3.75}
            >
              {t("succeededImpressionPackageOrderPaymentSubTitle")}
            </AppTypography>
            <AppTypography align="center">
              <Trans
                t={t}
                defaults="succeededImpressionPackageOrderPaymentCaption"
                components={{
                  p1: (
                    <AppTypography
                      component="span"
                      variant="inherit"
                      color="primary.main"
                    />
                  ),
                }}
              />
            </AppTypography>
          </div>
        </LoadingOverlay>
      </AppDialogContent>
      {!isLoading && (
        <AppDialogActions>
          <AppContainer
            maxWidth={isTabletDown ? "tablet" : "xs"}
            disableGutters={"tabletDown"}
            sx={{ display: "flex", alignItems: "center", gap: "inherit" }}
          >
            <AppButton
              fullWidth
              variant="contained"
              color="common.darkNeutral"
              onClick={closeImpressionPackageOrderPaymentStatusDialog}
            >
              {t("done")}
            </AppButton>
          </AppContainer>
        </AppDialogActions>
      )}
    </>
  );
};

export default PaymentSuccess;
