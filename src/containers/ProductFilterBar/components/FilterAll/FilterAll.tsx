import * as yup from "yup";

import { commonHelpers, formikHelpers } from "@/utils/helpers";
import { storeProductConditionSelectors } from "@/store";

import { FastField, Form, Formik, useFormikContext } from "formik";
import { Box, Zoom } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import FilterIcon from "@@/public/images/icons/filter.svg";
import AppBadge from "@/components/AppBadge/AppBadge";
import AppDrawer from "@/components/AppDrawer";
import AppDrawerTitle from "@/components/AppDrawerTitle";
import AppDrawerTitleIcon from "@/components/AppDrawerTitleIcon";
import AppIconButton from "@/components/AppIconButton";
import ProductCategoryAutocomplete from "@/containers/ProductCategoryAutocomplete";
import AsyncAutocomplete from "@/components/AsyncAutocomplete";
import AppSelect from "@/components/AppSelect";
import AppLoading from "@/components/AppLoading";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";
import AppTextFieldGroup from "@/components/AppTextFieldGroup";
import AppFormHelperText from "@/components/AppFormHelperText";
import AppTextField from "@/components/AppTextField";
import AppNumberFormat from "@/components/AppNumberFormat";
import AppInputLabel from "@/components/AppInputLabel";
import AppFormControlLabel from "@/components/AppFormControlLabel";
import AppCheckbox from "@/components/AppCheckbox";
import AppDrawerTitleText from "@/components/AppDrawerTitleText";
import AppDrawerBody from "@/components/AppDrawerBody";
import AppDrawerActions from "@/components/AppDrawerActions";
import AppMenuItem from "@/components/AppMenuItem";
import AppListItemText from "@/components/AppListItemText";

import CloseIcon from "@@/public/images/icons/close.svg";

import { useContext, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "react-i18next";

import ProductFilterBarContext from "@/containers/ProductFilterBar/ProductFilterBar.context";

import type { FastFieldProps, FormikProps } from "formik";

type FilterFormValues = {
  product_category: {
    id: number;
    title: string;
  } | null;
  brands: {
    id: number;
    title: string;
  }[];
  product_sort: {
    id: number;
    title: string;
  } | null;
  product_conditions: {
    id: number;
    title: string;
  }[];
  max_price: EmptySafeNumber;
  min_price: EmptySafeNumber;
  is_trade_in_person: BooleanNumber;
  is_post_courier: BooleanNumber;
};

const SubmitButton = () => {
  const { values, validateForm, handleSubmit } = useFormikContext();

  const { t } = useTranslation();

  return (
    <AppButton
      fullWidth
      noWrap
      color="primary"
      variant="contained"
      type="submit"
      onClick={formikHelpers.handleValidateAndSubmit({
        handleSubmit,
        validateForm,
        values,
      })}
    >
      {t("apply")}
    </AppButton>
  );
};

const PriceFormLabel = () => {
  const { errors } = useFormikContext<FilterFormValues>();

  const { t } = useTranslation();

  return (
    <AppInputLabel error={!!errors.min_price || !!errors.max_price}>
      {t("price")}
    </AppInputLabel>
  );
};

const FormikProductSortSelect = (props: any) => {
  const { onChange, value, name } = props;

  const { t } = useTranslation();

  const $s_productSorts = useAppSelector(
    (state) => state.productSort.productSorts
  );
  const $s_productSortsLoading = useAppSelector(
    (state) => state.productSort.productSortsLoading
  );
  const $s_productSortsError = useAppSelector(
    (state) => state.productSort.productSortsError
  );

  const handleProductSortChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const productSort = $s_productSorts.find(
      (productSort) => productSort?.id === Number(event.target.value as any)
    );
    onChange({
      target: {
        name,
        value: productSort ?? null,
      },
    });
  };

  return (
    <AppSelect
      label={t("sort")}
      bgColor="white"
      displayEmpty
      fullWidth
      endAdornment={
        ($s_productSortsLoading || !!$s_productSortsError) && (
          <AppInputAdornment position="end">
            <AppLoading size={24} />
          </AppInputAdornment>
        )
      }
      sx={{ mb: 2.5 }}
      name={name}
      value={value?.id ?? ""}
      onChange={handleProductSortChange as any}
    >
      <AppSelectMenuItem value={""} disabledCheckedIcon>
        &nbsp;
      </AppSelectMenuItem>
      {$s_productSorts.map((productSort) => (
        <AppSelectMenuItem key={productSort.id} value={productSort.id}>
          {productSort.title}
        </AppSelectMenuItem>
      ))}
    </AppSelect>
  );
};

const ProductConditionSelectFormField = (props: FastFieldProps) => {
  const { field, form } = props;

  const { t } = useTranslation();

  const $s_productConditions = useAppSelector(
    (state) => state.productCondition.productConditions
  );
  const $s_productConditionsError = useAppSelector(
    (state) => state.productCondition.productConditionsError
  );
  const $s_productConditionsLoading = useAppSelector(
    (state) => state.productCondition.productConditionsLoading
  );
  const $s_idToProductConditionMap = useAppSelector(
    storeProductConditionSelectors.selectIdToProductConditionsMap
  );

  const handleProductConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newProductConditionIds = event.target.value as unknown as number[];
    const productConditions = $s_productConditions.filter((productCondition) =>
      newProductConditionIds.includes(productCondition.id)
    );
    form.setFieldTouched(field.name, true);
    form.setFieldValue(field.name, productConditions);
  };

  return (
    <AppSelect
      label={t("condition")}
      fullWidth
      bgColor="common.white"
      sx={{ mb: 2.5 }}
      getOptionLabel={(value) => $s_idToProductConditionMap[value]?.title ?? ""}
      displayEmpty
      multiple
      {...field}
      value={field.value.map((v: any) => v.id)}
      endAdornment={
        $s_productConditionsLoading && (
          <AppInputAdornment position="end">
            <AppLoading size={20} />
          </AppInputAdornment>
        )
      }
      onChange={handleProductConditionChange as any}
    >
      {$s_productConditionsLoading ? (
        <AppMenuItem disabled>
          <AppListItemText primary={`${"loading"}...`} />
        </AppMenuItem>
      ) : !!$s_productConditionsError ? (
        <AppMenuItem disabled sx={{ opacity: 1 }}>
          <AppListItemText primary={$s_productConditionsError} /> :
        </AppMenuItem>
      ) : (
        $s_productConditions.map((productCondition) => (
          <AppSelectMenuItem
            key={productCondition.id}
            value={productCondition.id}
            native={false}
          >
            <AppListItemText primary={productCondition.title} />
          </AppSelectMenuItem>
        ))
      )}
    </AppSelect>
  );
};

const PriceFormErrorMessage = () => {
  const { errors } = useFormikContext<FilterFormValues>();

  if (!errors.min_price && !errors.max_price) return null;

  return (
    <AppFormHelperText error>
      {errors.min_price || errors.max_price}
    </AppFormHelperText>
  );
};

const SimpleForm = () => {
  const { requiredProductCategory, disabledProductSort } = useContext(
    ProductFilterBarContext
  );

  const { t } = useTranslation();

  const $s_regionCurrency = useAppSelector(
    (state) => state.common.region?.currency
  );

  return (
    <>
      <FastField name="product_category">
        {({ field, meta, form }: FastFieldProps) => (
          <ProductCategoryAutocomplete
            defaultInputProps={{
              label: t("category"),
              bgColor: "common.white",
              required: !!requiredProductCategory,
              error: !!formikHelpers.showError({
                error: meta.error,
                submitCount: form.submitCount,
                touched: meta.touched,
              }),
              helperText: formikHelpers.showError({
                error: meta.error,
                submitCount: form.submitCount,
                touched: meta.touched,
              }),
            }}
            disableClearable={!!requiredProductCategory}
            showBreadcrumbs
            {...field}
            sx={{ mb: 2.5 }}
          />
        )}
      </FastField>
      <FastField name="brands">
        {({ field }: FastFieldProps) => (
          <AsyncAutocomplete
            multiple
            disableCloseOnSelect
            module="brands"
            defaultInputProps={{
              label: t("brand"),
              bgColor: "common.white",
            }}
            sx={{ mb: 2.5 }}
            {...field}
          />
        )}
      </FastField>
      {!disabledProductSort && (
        <FastField name="product_sort">
          {({ field }: FastFieldProps) => (
            <FormikProductSortSelect {...field} />
          )}
        </FastField>
      )}
      <FastField name="product_conditions">
        {(fastFieldProps: FastFieldProps) => (
          <ProductConditionSelectFormField {...fastFieldProps} />
        )}
      </FastField>
      <Box mb={2.5 - 1}>
        <PriceFormLabel />
        <AppTextFieldGroup fullWidth sx={{ mt: 0.5 }}>
          <FastField name="min_price">
            {({ field, form, meta }: FastFieldProps) => (
              <AppTextField
                placeholder={t("minimum")}
                bgColor="common.white"
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
                bgColor="common.white"
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
        <PriceFormErrorMessage />
      </Box>
      <div>
        <FastField name="is_trade_in_person">
          {({ field }: FastFieldProps) => (
            <AppFormControlLabel
              label={t("tradeInPerson")}
              control={<AppCheckbox checked={!!field.value} />}
              {...field}
              onChange={(_, checked) => {
                field.onChange({
                  target: {
                    name: field.name,
                    value: checked ? 1 : 0,
                  },
                });
              }}
            />
          )}
        </FastField>
      </div>
      <FastField name="is_post_courier">
        {({ field }: FastFieldProps) => (
          <AppFormControlLabel
            label={t("byPostAndCourier")}
            control={<AppCheckbox checked={!!field.value} />}
            {...field}
            onChange={(_, checked) => {
              field.onChange({
                target: {
                  name: field.name,
                  value: checked ? 1 : 0,
                },
              });
            }}
          />
        )}
      </FastField>
    </>
  );
};

const FilterAll = () => {
  const { requiredProductCategory, filtering, filterValue, setFilterValue } =
    useContext(ProductFilterBarContext);

  const [allFiltersDrawerOpen, setAllFiltersDrawerOpen] = useState(false);

  const { t } = useTranslation();

  const formikRef = useRef<FormikProps<FilterFormValues>>(undefined!);

  const initialValues = useMemo<FilterFormValues>(() => {
    return {
      brands: filterValue.brands ?? [],
      max_price: filterValue.max_price! ?? "",
      is_post_courier: filterValue.is_post_courier! ?? 0,
      is_trade_in_person: filterValue.is_trade_in_person! ?? 0,
      min_price: filterValue.min_price! ?? "",
      product_category: filterValue.product_category ?? null,
      product_conditions: filterValue.product_conditions ?? [],
      product_sort: filterValue.product_sort ?? null,
    };
  }, [filterValue]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      min_price: yup
        .number()
        .test(
          "lowest-price-required",
          t("minPriceIsRequired"),
          (minPrice, context) => {
            const maxPrice = context.parent.max_price;
            return (
              commonHelpers.isEmpty(maxPrice) ||
              !commonHelpers.isEmpty(minPrice)
            );
          }
        ),
      max_price: yup
        .number()
        .test(
          "greater-than-lowest-price",
          t("maxPriceMustBeGreaterThanOrEqualToMinPrice"),
          (maxPrice, context) => {
            const minPrice: number = context.parent.min_price ?? 0;
            return (maxPrice ?? 0) >= minPrice;
          }
        ),
      ...(requiredProductCategory
        ? {
            product_category: yup.object().required(t("categoryIsRequired")),
          }
        : {}),
    });
  }, [requiredProductCategory, t]);

  const handleFilterFormSubmit = (values: FilterFormValues) => {
    setFilterValue({
      ...values,
    });
    setAllFiltersDrawerOpen(false);
  };

  const handleResetClick = () => {
    formikRef.current.resetForm({
      values: {
        brands: [],
        max_price: "",
        is_post_courier: 0,
        is_trade_in_person: 0,
        min_price: "",
        product_category: null,
        product_conditions: [],
        product_sort: null,
      },
    });
  };

  const handleAllFilterDrawerClose = () => {
    setAllFiltersDrawerOpen(false);
  };

  const handleAllFilterDrawerOpen = () => {
    setAllFiltersDrawerOpen(true);
    formikRef.current.resetForm({
      values: initialValues,
      errors: {},
      touched: {},
      submitCount: 0,
    });
  };

  return (
    <>
      <AppButton
        variant="outlined"
        color="text.primary"
        borderRadius="circular"
        startIcon={
          <AppBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            badgeContent={
              <Zoom in={filtering}>
                <Box
                  width={8}
                  height={8}
                  bgcolor="common.dotRed"
                  borderRadius={"50%"}
                />
              </Zoom>
            }
          >
            <AppSvgIcon
              fontSize="inherit"
              component={FilterIcon}
              sx={{ my: "-2px", mr: "-2px" }}
            />
          </AppBadge>
        }
        sx={{
          textTransform: "uppercase",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        onClick={handleAllFilterDrawerOpen}
      >
        {t("allFilters")}
      </AppButton>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFilterFormSubmit}
      >
        <AppDrawer
          open={allFiltersDrawerOpen}
          component={Form}
          onClose={handleAllFilterDrawerClose}
        >
          <AppDrawerTitle stickyHeader>
            <AppDrawerTitleText>{t("filters")}</AppDrawerTitleText>
            <AppDrawerTitleIcon position="end">
              <AppIconButton
                color="text.primary"
                edge={"xy"}
                borderRadius="circular"
                onClick={handleAllFilterDrawerClose}
              >
                <AppSvgIcon component={CloseIcon} />
              </AppIconButton>
            </AppDrawerTitleIcon>
          </AppDrawerTitle>
          <AppDrawerBody>
            <SimpleForm />
          </AppDrawerBody>
          <AppDrawerActions stickyFooter>
            <AppButton
              fullWidth
              noWrap
              variant="outlined"
              color="primary"
              onClick={handleResetClick}
            >
              {t("reset")}
            </AppButton>
            <SubmitButton />
          </AppDrawerActions>
        </AppDrawer>
      </Formik>
    </>
  );
};

export default FilterAll;
