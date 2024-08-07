import { productConstants } from "@/utils/constants";

import AppPaper from "@/components/AppPaper";
import AppPaperContent from "@/components/AppPaperContent";
import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";
import SlugProductContext from "../../SlugProduct.context";

import BarChartIncreaseIcon from "@@/public/images/icons/bar-chart-increase.svg";
import ShoppingCartVisitIcon from "@@/public/images/icons/shopping-cart-visit.svg";

import { useAppMomentWithLocale, useAppSelector } from "@/hooks";
import { useContext } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./SellerActionCard.styles";

const PurchaseVisitsButton = () => {
  const { openProductPurchaseVisitsFormDialog } =
    useContext(SlugProductContext);

  const $s_productStateNumber = useAppSelector(
    (state) => state.product.product?.product?.state
  );
  const $s_productPurchasable = useAppSelector(
    (state) => !!state.product.product?.product?.purchase_enable
  );

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      noWrap
      variant="contained"
      color="text.primary"
      disabled={
        $s_productStateNumber !== productConstants.NORMAL_STATE_NUMBER ||
        !$s_productPurchasable
      }
      startIcon={
        <AppSvgIcon component={ShoppingCartVisitIcon} fontSize="inherit" />
      }
      onClick={openProductPurchaseVisitsFormDialog}
    >
      {t("purchaseVisits")}
    </AppButton>
  );
};

const SellerActionCard = () => {
  const { openProductItemReportDialog } = useContext(SlugProductContext);

  const { classes } = useStyles();

  const { momentWithLocale, momentWithLocaleByCurrentTz } =
    useAppMomentWithLocale();

  const { t } = useTranslation();

  const $s_productTraffic = useAppSelector(
    (state) => state.product.product?.product?.traffic
  );
  const $s_productCreatedTime = useAppSelector(
    (state) => state.product.product?.product?.create_time
  );

  const $s_productCreatedTimeMoment = !!$s_productCreatedTime
    ? momentWithLocaleByCurrentTz($s_productCreatedTime, "X").format(
        "YYYY-MM-DD"
      )
    : 0;
  const nowMoment = momentWithLocale();

  const createdDayCount = !$s_productCreatedTimeMoment
    ? 1
    : nowMoment.diff($s_productCreatedTimeMoment, "days") || 1;

  return (
    <AppPaper boxShadowVariant="card">
      <AppPaperContent className={classes.content}>
        <AppTypography>
          {t("yourListingHasBeenCountViewedInLastDayWithCount", {
            ...((($s_productTraffic ?? 0) >= 2 ||
              ($s_productTraffic ?? 0) === 0) &&
            createdDayCount === 1
              ? {
                  context: "timeWithCountOnOneDay",
                  count: $s_productTraffic ?? 0,
                }
              : ($s_productTraffic ?? 0) === 1 &&
                (createdDayCount >= 2 || createdDayCount === 0)
              ? {
                  context: "dayWithCountOnOneTime",
                  count: createdDayCount,
                }
              : {
                  timesCount: $s_productTraffic ?? 0,
                  daysCount: createdDayCount,
                }),
          })}
        </AppTypography>
        <AppButton
          fullWidth
          noWrap
          variant="contained"
          color="primary"
          startIcon={
            <AppSvgIcon component={BarChartIncreaseIcon} fontSize="inherit" />
          }
          onClick={openProductItemReportDialog}
        >
          {t("reviewResults")}
        </AppButton>
        <PurchaseVisitsButton />
      </AppPaperContent>
    </AppPaper>
  );
};

export default SellerActionCard;
