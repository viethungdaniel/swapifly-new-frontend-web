import { commonHelpers } from "@/utils/helpers";
import { storeCommonSelectors } from "@/store";

import { Grid } from "@mui/material";
import AppTypography from "@/components/AppTypography";
import AppRadio from "@/components/AppRadio";
import AppFormControlLabel from "@/components/AppFormControlLabel";

import { useTranslation } from "next-i18next";
import { useContext } from "react";
import { useAppSelector } from "@/hooks";

import ProductPurchaseVisitsFormDialogContext from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog.context";

import type { FastFieldProps, FieldInputProps } from "formik";
import type { ImpressionPackageOrderFormValues } from "@/containers/ProductPurchaseVisitsFormDialog/ProductPurchaseVisitsFormDialog";

const ImpressionPackageSelectFormField = (
  props: FastFieldProps<ImpressionPackageOrderFormValues>
) => {
  const { form } = props;
  const field = props.field as unknown as FieldInputProps<
    ImpressionPackageOrderFormValues["impression_package_id"]
  >;

  const { impressionPackages } = useContext(
    ProductPurchaseVisitsFormDialogContext
  );

  const $s_defaultRegion = useAppSelector(
    storeCommonSelectors.selectDefaultRegion
  );

  const { t } = useTranslation();

  return (
    <Grid container spacing={{ xs: 1.25, tablet: 2.5 }}>
      {impressionPackages.map((impressionPackage) => (
        <Grid key={impressionPackage.id} item xs={12} tablet={6}>
          <AppFormControlLabel
            fullWidth
            variant="filled"
            disableGutters
            label={
              <>
                <AppTypography color="text.primary">
                  {t("impressionWithCountOnDayWithCount", {
                    impressionWithCount: impressionPackage.number,
                    dayWithCount: impressionPackage.days,
                  })}
                </AppTypography>
                <AppTypography variant="bodyMed14" color="primary.main">
                  {$s_defaultRegion?.currency}{" "}
                  {commonHelpers.formatNumber(impressionPackage.price)}
                </AppTypography>
              </>
            }
            control={
              <AppRadio color="text.primary" value={impressionPackage.id} />
            }
            checked={impressionPackage.id === field.value}
            onClick={() => {
              form.setValues((prevValues) => ({
                ...prevValues,
                impression_package_id: impressionPackage.id,
                impression_package_order_coupon_state: null,
              }));
              form.setFieldTouched("impression_package_id", true);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ImpressionPackageSelectFormField;
