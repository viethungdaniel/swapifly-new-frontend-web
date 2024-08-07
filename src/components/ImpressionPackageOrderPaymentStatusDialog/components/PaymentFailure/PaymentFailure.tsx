import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppDialogActions from "@/components/AppDialogActions";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";

import PaymentFailedSvg from "@@/public/images/svgs/payment-failed.svg";

import { useContext } from "react";
import { useMediaQuery } from "@mui/material";
import { useTranslation } from "next-i18next";

import ImpressionPackageOrderPaymentStatusDialogContext from "@/components/ImpressionPackageOrderPaymentStatusDialog/ImpressionPackageOrderPaymentStatusDialog.context";

import useStyles from "./PaymentFailure.styles";

const PaymentFailure = () => {
  const { paymentError, closeImpressionPackageOrderPaymentStatusDialog } =
    useContext(ImpressionPackageOrderPaymentStatusDialogContext);

  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <>
      <AppDialogTitle
        onCloseButtonClick={closeImpressionPackageOrderPaymentStatusDialog}
      />
      <AppDialogContent className={classes.content}>
        <AppSvgIcon
          component={PaymentFailedSvg}
          sx={{ fontSize: 80, mb: 3.75 }}
        />
        <AppTypography mb={0.5} variant="bodyMed18" align="center">
          {t("failedImpressionPackageOrderPaymentTitle")}
        </AppTypography>
        <AppTypography align="center" color="text.secondary">
          {paymentError || t("failedImpressionPackageOrderPaymentSubTitle")}
        </AppTypography>
      </AppDialogContent>
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
    </>
  );
};

export default PaymentFailure;
