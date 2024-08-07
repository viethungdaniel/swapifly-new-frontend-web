import * as yup from "yup";

import { commonHelpers, formikHelpers } from "@/utils/helpers";

import { ClickAwayListener, Grow, Popper } from "@mui/material";
import { FastField, Form, Formik, useFormikContext } from "formik";
import AppButton from "@/components/AppButton";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppPaper from "@/components/AppPaper";
import AppTextField from "@/components/AppTextField";
import AppTextFieldGroup from "@/components/AppTextFieldGroup";
import AppNumberFormat from "@/components/AppNumberFormat";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppFormHelperText from "@/components/AppFormHelperText";
import AppTypography from "@/components/AppTypography";
import AppInputLabel from "@/components/AppInputLabel";

import ArrowDownIcon from "@@/public/images/icons/arrow-down.svg";

import { useContext, useMemo, useState } from "react";

import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import ProductFilterBarContext from "@/containers/ProductFilterBar/ProductFilterBar.context";

import useStyles from "./SortByPrice.styles";

import type { FastFieldProps } from "formik";

type SortByPriceValues = {
  min_price: EmptySafeNumber;
  max_price: EmptySafeNumber;
};

const SortByPriceFormLabel = () => {
  const { errors } = useFormikContext<SortByPriceValues>();

  const { t } = useTranslation();

  return (
    <AppInputLabel error={!!errors.min_price || !!errors.max_price}>
      {t("price")}
    </AppInputLabel>
  );
};

const SortByPriceFormErrorMessage = () => {
  const { errors } = useFormikContext<SortByPriceValues>();

  if (!errors.min_price && !errors.max_price) return null;

  return (
    <AppFormHelperText error>
      {errors.min_price || errors.max_price}
    </AppFormHelperText>
  );
};

const SortByPriceForm = (props: {
  onSubmit?: (values: SortByPriceValues) => void;
  onClear?: () => void;
}) => {
  const { onClear, onSubmit } = props;

  const { t } = useTranslation();

  const { filterValue } = useContext(ProductFilterBarContext);

  const $s_regionCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  const initialValues = useMemo<SortByPriceValues>(() => {
    return {
      max_price: filterValue.max_price!,
      min_price: filterValue.min_price!,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      min_price: yup.number().required(t("minPriceIsRequired")),
      max_price: yup
        .number()
        .required(t("maxPriceIsRequired"))
        .test(
          "greater-than-lowest-price",
          t("maxPriceMustBeGreaterThanOrEqualToMinPrice"),
          (maxPrice, context) => {
            const minPrice: number = context.parent.min_price ?? 0;
            return maxPrice >= minPrice;
          }
        ),
    });
  }, []);

  const { classes } = useStyles();

  const handleFormSubmit = (values: SortByPriceValues) => {
    onSubmit && onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      <AppPaper
        className={classes.sortByPriceForm}
        boxShadowVariant="menuPopper"
        component={Form}
      >
        <SortByPriceFormLabel />
        <AppTextFieldGroup sx={{ mt: 0.5 }}>
          <FastField name="min_price">
            {({ field, form, meta }: FastFieldProps) => (
              <AppTextField
                placeholder={t("minimum")}
                startAdornment={
                  <AppInputAdornment position="start">
                    {$s_regionCurrency}
                  </AppInputAdornment>
                }
                inputComponent={AppNumberFormat as any}
                error={
                  !!formikHelpers.showError({
                    error: meta.error,
                    submitCount: form.submitCount,
                    touched: meta.touched,
                  })
                }
                {...field}
              />
            )}
          </FastField>
          <FastField name="max_price">
            {({ field, form, meta }: FastFieldProps) => (
              <AppTextField
                placeholder={t("maximum")}
                startAdornment={
                  <AppInputAdornment position="start">
                    {$s_regionCurrency}
                  </AppInputAdornment>
                }
                inputComponent={AppNumberFormat as any}
                error={
                  !!formikHelpers.showError({
                    error: meta.error,
                    submitCount: form.submitCount,
                    touched: meta.touched,
                  })
                }
                {...field}
              />
            )}
          </FastField>
        </AppTextFieldGroup>
        <SortByPriceFormErrorMessage />
        <div className={classes.sortByPriceFormActions}>
          <AppButton variant="outlined" color="text.primary" onClick={onClear}>
            {t("clear")}
          </AppButton>
          <AppButton variant="contained" color="primary" type="submit">
            {t("apply")}
          </AppButton>
        </div>
      </AppPaper>
    </Formik>
  );
};

const SortByPrice = () => {
  const { filterValue, setFilterValue } = useContext(ProductFilterBarContext);

  const $s_regionCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  const [popperOpen, setPopperOpen] = useState(false);
  const [popperAnchorEl, setPopperAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const { t } = useTranslation();

  const { classes, theme, cx } = useStyles();

  const handlePopperClose = () => {
    setPopperOpen(false);
  };

  const handlePopperToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopperOpen(!popperOpen);
    setPopperAnchorEl(event.currentTarget);
  };

  const handleSortByPriceFormSubmit = (values: SortByPriceValues) => {
    setPopperOpen(false);
    const newFilterValue = {
      ...filterValue,
      max_price: Number(values.max_price),
      min_price: Number(values.min_price),
    };
    setFilterValue(newFilterValue);
  };

  const handleSortByPriceFormClear = () => {
    setPopperOpen(false);
    const newFilterValue = {
      ...filterValue,
      max_price: "" as const,
      min_price: "" as const,
    };
    setFilterValue(newFilterValue);
  };

  return (
    <div>
      <AppButton
        variant="outlined"
        color="text.primary"
        borderRadius="circular"
        endIcon={
          <AppSvgIcon
            className={cx(
              classes.sortByPriceArrowIcon,
              popperOpen && classes.sortByPriceArrowIconRotated
            )}
            component={ArrowDownIcon}
            fontSize="inherit"
          />
        }
        disableRipple
        onClick={handlePopperToggle}
      >
        <AppTypography component="span">
          {commonHelpers.isNumber(filterValue.max_price) &&
          commonHelpers.isNumber(filterValue.min_price)
            ? `${$s_regionCurrency} ${commonHelpers.formatNumber(
                filterValue.min_price
              )} - ${$s_regionCurrency} ${commonHelpers.formatNumber(
                filterValue.max_price
              )}`
            : t("price")}
        </AppTypography>
      </AppButton>
      <Popper
        anchorEl={popperAnchorEl}
        open={popperOpen}
        placement="bottom"
        transition
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
          {
            name: "flip",
            enabled: false,
          },
        ]}
        style={{
          zIndex: theme.zIndex.tooltip,
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handlePopperClose as any}>
            <Grow {...TransitionProps} style={{ transformOrigin: "50% 0 0" }}>
              <div>
                <SortByPriceForm
                  onSubmit={handleSortByPriceFormSubmit}
                  onClear={handleSortByPriceFormClear}
                />
              </div>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </div>
  );
};

export default SortByPrice;
