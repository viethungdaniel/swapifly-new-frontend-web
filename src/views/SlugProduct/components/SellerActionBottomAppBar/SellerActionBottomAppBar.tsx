import { commonHelpers } from "@/utils/helpers";
import { productConstants } from "@/utils/constants";

import { Collapse, useMediaQuery } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";
import MainBottomAppBarToolbar from "@/components/MainBottomAppBarToolbar";
import AppLink from "@/components/AppLink";

import EditIcon from "@@/public/images/icons/edit.svg";
import DeleteIcon from "@@/public/images/icons/delete.svg";
import CheckedIcon from "@@/public/images/icons/checked.svg";
import ShoppingCartVisitIcon from "@@/public/images/icons/shopping-cart-visit.svg";
import BarChartIncreaseIcon from "@@/public/images/icons/bar-chart-increase.svg";
import ArrowDownIcon from "@@/public/images/icons/arrow-down.svg";
import AppBottomAppBar from "@/components/AppBottomAppBar";

import { useContext, useState } from "react";
import { useAppMomentWithLocale, useAppSelector } from "@/hooks";
import { useTranslation } from "react-i18next";

import SlugProductContext from "@/views/SlugProduct/SlugProduct.context";

import useStyles from "./SellerActionBottomAppBar.styles";

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
      variant="contained"
      color="text.primary"
      noWrap
      fullWidth
      startIcon={
        <AppSvgIcon component={ShoppingCartVisitIcon} fontSize="inherit" />
      }
      disabled={
        $s_productStateNumber !== productConstants.NORMAL_STATE_NUMBER ||
        !$s_productPurchasable
      }
      onClick={openProductPurchaseVisitsFormDialog}
    >
      {t("purchaseVisits")}
    </AppButton>
  );
};

const BuyerActionBottomAppBar = () => {
  const {
    productId,
    productDeleted,
    markSoldProduct,
    deleteProduct,
    openProductItemReportDialog,
  } = useContext(SlugProductContext);

  const [contentCollapseIn, setContentCollapseIn] = useState(false);

  const { momentWithLocale, momentWithLocaleByCurrentTz } =
    useAppMomentWithLocale();

  const { t } = useTranslation();

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_productSellerId = useAppSelector(
    (state) => state.product.product?.seller?.id
  );
  const $s_productStateNumber = useAppSelector(
    (state) => state.product.product?.product?.state
  );
  const $s_productTraffic = useAppSelector(
    (state) => state.product.product?.product?.traffic
  );
  const $s_productTitle = useAppSelector(
    (state) => state.product.product?.product?.title
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

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const handleContentCollapseToggle = () => {
    setContentCollapseIn((prevContentCollapseIn) => !prevContentCollapseIn);
  };

  if (!$s_authUserId || $s_authUserId !== $s_productSellerId) return null;

  return isTabletDown ? (
    <>
      <AppBottomAppBar>
        <MainBottomAppBarToolbar
          enablePaddingY
          autoHeight
          className={classes.mainBottomAppBarToolbar}
          sx={{
            pointerEvents: productDeleted ? "none" : "auto",
          }}
        >
          <Collapse in={contentCollapseIn}>
            <div className={classes.actionList}>
              <AppButton
                fullWidth
                noWrap
                color="text.primary"
                variant="outlined"
                component={AppLink}
                href="/inbox"
                underline="none"
                hoverColor="none"
              >
                {t("viewConversation")}
              </AppButton>
              <AppIconButton
                {...($s_productStateNumber !==
                productConstants.SOLD_STATE_NUMBER
                  ? {
                      component: AppLink,
                      href: `/sell/${commonHelpers.generateProductSlug(
                        $s_productTitle,
                        productId
                      )}`,
                      hoverColor: "none",
                      underline: "none",
                    }
                  : {})}
                disabled={
                  $s_productStateNumber === productConstants.SOLD_STATE_NUMBER
                }
                edge="x"
                color="text.primary"
              >
                <AppSvgIcon component={EditIcon} fontSize="inherit" />
              </AppIconButton>
              <AppIconButton
                edge="x"
                color="text.primary"
                disabled={
                  $s_productStateNumber === productConstants.SOLD_STATE_NUMBER
                }
                onClick={markSoldProduct}
              >
                <AppSvgIcon component={CheckedIcon} fontSize="inherit" />
              </AppIconButton>
              <AppIconButton
                edge="x"
                color="text.primary"
                onClick={deleteProduct}
              >
                <AppSvgIcon component={DeleteIcon} fontSize="inherit" />
              </AppIconButton>
            </div>
            <AppTypography my={1.25}>
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
          </Collapse>
          <div className={classes.actionList}>
            <PurchaseVisitsButton />
            <AppButton
              variant="contained"
              color="primary"
              noWrap
              fullWidth
              startIcon={
                <AppSvgIcon
                  component={BarChartIncreaseIcon}
                  fontSize="inherit"
                />
              }
              onClick={openProductItemReportDialog}
            >
              {t("reviewResults")}
            </AppButton>
            <AppIconButton
              color="text.primary"
              borderRadius="circular"
              edge="x"
              sx={(theme) => ({
                rotate: contentCollapseIn ? "0deg" : "180deg",
                transition: theme.transitions.create(["rotate"]),
              })}
              onClick={handleContentCollapseToggle}
            >
              <AppSvgIcon component={ArrowDownIcon} fontSize="inherit" />
            </AppIconButton>
          </div>
        </MainBottomAppBarToolbar>
      </AppBottomAppBar>
    </>
  ) : null;
};

export default BuyerActionBottomAppBar;
