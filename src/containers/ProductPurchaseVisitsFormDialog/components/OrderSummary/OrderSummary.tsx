import { storeCommonSelectors } from "@/store";
import { commonHelpers } from "@/utils/helpers";

import AppTypography from "@/components/AppTypography";

import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/hooks";
import { useContext, useMemo } from "react";

import ProductPurchaseVisitsFormDialogContext from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog.context";

import useStyles from "./OrderSummary.styles";

import type { FastFieldProps } from "formik";
import type { ImpressionPackageOrderFormValues } from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog";

const OrderSummary = (
  props: FastFieldProps<ImpressionPackageOrderFormValues>
) => {
  const { form } = props;

  const { impressionPackages } = useContext(
    ProductPurchaseVisitsFormDialogContext
  );

  const $s_defaultRegion = useAppSelector(
    storeCommonSelectors.selectDefaultRegion
  );

  const selectedImpressionPackage = useMemo(() => {
    return (
      impressionPackages.find(
        (impressionPackage) =>
          impressionPackage.id === form.values.impression_package_id
      ) ?? null
    );
  }, [impressionPackages, form.values.impression_package_id]);

  const { t } = useTranslation();

  const { classes } = useStyles();

  return (
    <div className={classes.orderSummaryList}>
      {!!form.values.impression_package_order_coupon_state && (
        <>
          <div className={classes.orderSummaryItem}>
            <AppTypography flex={1}>{t("subtotal")}</AppTypography>
            <AppTypography variant="bodyMed16">
              {$s_defaultRegion?.currency}{" "}
              {commonHelpers.formatNumber(
                form.values.impression_package_order_coupon_state?.subtotal || 0
              )}
            </AppTypography>
          </div>
          <div className={classes.orderSummaryItem}>
            <AppTypography flex={1}>{t("discount")}</AppTypography>
            <AppTypography variant="bodyMed16">
              - {$s_defaultRegion?.currency}{" "}
              {commonHelpers.formatNumber(
                form.values.impression_package_order_coupon_state?.discount || 0
              )}
            </AppTypography>
          </div>
        </>
      )}
      <div className={classes.orderSummaryItem}>
        <AppTypography flex={1}>{t("total")}</AppTypography>
        <AppTypography variant="bodyMed16" color="primary.main">
          {$s_defaultRegion?.currency}{" "}
          {commonHelpers.formatNumber(
            commonHelpers.isNumber(
              form.values.impression_package_order_coupon_state?.total
            )
              ? form.values.impression_package_order_coupon_state?.total
              : selectedImpressionPackage?.price || 0
          )}
        </AppTypography>
      </div>
    </div>
  );
};

export default OrderSummary;
