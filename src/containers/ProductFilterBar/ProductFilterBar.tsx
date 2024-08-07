import { Box, Divider, useMediaQuery } from "@mui/material";
import _isEqual from "lodash/isEqual";

import { commonHelpers } from "@/utils/helpers";

import ProductCategoryAutocomplete from "@/containers/ProductCategoryAutocomplete";
import AppFormControlLabel from "@/components/AppFormControlLabel";
import AppCheckbox from "@/components/AppCheckbox";
import AppSelect from "@/components/AppSelect";
import AppSelectMenuItem from "@/components/AppSelectMenuItem";
import SortByPrice from "@/containers/ProductFilterBar/components/SortByPrice";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppLoading from "@/components/AppLoading";
import AsyncAutocomplete from "@/components/AsyncAutocomplete";
import AppButton from "@/components/AppButton";
import FilterAll from "@/containers/ProductFilterBar/components/FilterAll";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

import ProductFilterBarContext from "@/containers/ProductFilterBar/ProductFilterBar.context";

import useStyles from "./ProductFilterBar.styles";

import type { BoxProps } from "@mui/material";
import type { ProductCategoryAutocompleteProps } from "@/containers/ProductCategoryAutocomplete";

export type FilterValue = {
  product_category?: {
    id: number;
    title: string;
  } | null;
  brands?: {
    id: number;
    title: string;
  }[];
  product_sort?: {
    id: number;
    title: string;
  } | null;
  product_conditions?: {
    id: number;
    title: string;
  }[];
  max_price?: EmptySafeNumber;
  min_price?: EmptySafeNumber;
  is_trade_in_person?: BooleanNumber;
  is_post_courier?: BooleanNumber;
};

type CustomProductFilterBar = {
  filterValue?: FilterValue;
  requiredProductCategory?: boolean;
  disabledProductSort?: boolean;
  onFilterValueChange?: (value: Required<FilterValue>) => void;
};

export type ProductFilterBarProps = Omit<
  BoxProps,
  keyof CustomProductFilterBar
> &
  CustomProductFilterBar;

const ProductSortSelect = () => {
  const { filterValue, setFilterFieldValue } = useContext(
    ProductFilterBarContext
  );

  const $s_productSorts = useAppSelector(
    (state) => state.productSort.productSorts
  );
  const $s_productSortsLoading = useAppSelector(
    (state) => state.productSort.productSortsLoading
  );
  const $s_productSortsError = useAppSelector(
    (state) => state.productSort.productSortsError
  );

  const { t } = useTranslation();

  const { classes } = useStyles();

  const handleFilterProductSortChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const productSort = $s_productSorts.find(
      (productSort) => productSort?.id === (event.target.value as any)
    );
    setFilterFieldValue("product_sort", productSort || null);
  };

  return (
    <AppSelect
      borderRadius="circular"
      borderColor="text.primary"
      hoverBorderColor="text.primary"
      placeholder={t("sort")}
      displayEmpty
      value={filterValue.product_sort?.id || ""}
      appClasses={{
        placeholder: classes.filterInputPlaceholder,
      }}
      endAdornment={
        ($s_productSortsLoading || !!$s_productSortsError) && (
          <AppInputAdornment position="end">
            <AppLoading size={24} />
          </AppInputAdornment>
        )
      }
      onChange={handleFilterProductSortChange as any}
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

const ConditionSelect = () => {
  const { filterValue, setFilterFieldValue } = useContext(
    ProductFilterBarContext
  );

  const { t } = useTranslation();

  const { classes } = useStyles();

  const $s_productConditions = useAppSelector(
    (state) => state.productCondition.productConditions
  );
  const $s_productConditionsLoading = useAppSelector(
    (state) => state.productCondition.productConditionsLoading
  );
  const $s_productConditionsError = useAppSelector(
    (state) => state.productCondition.productConditionsError
  );

  const handleFilterProductConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const productConditionIds = event.target.value as unknown as number[];
    let newFilterProductConditions = $s_productConditions!.filter(
      (productCondition) => productConditionIds.includes(productCondition.id)
    );
    setFilterFieldValue("product_conditions", newFilterProductConditions);
  };

  return (
    <AppSelect
      borderRadius="circular"
      borderColor="text.primary"
      hoverBorderColor="text.primary"
      placeholder={t("condition")}
      displayEmpty
      multiple
      limitTags={1}
      appClasses={{
        root: classes.filterSelect,
        placeholder: classes.filterInputPlaceholder,
      }}
      value={filterValue.product_conditions!.map(
        (productCondition) => productCondition.id
      )}
      endAdornment={
        ($s_productConditionsLoading || !!$s_productConditionsError) && (
          <AppInputAdornment position="end">
            <AppLoading size={24} />
          </AppInputAdornment>
        )
      }
      getOptionLabel={(value) =>
        ($s_productConditions.length > 0
          ? $s_productConditions
          : filterValue.product_conditions!
        ).find((productCondition) => productCondition.id === value)?.title
      }
      onChange={handleFilterProductConditionChange as any}
    >
      {$s_productConditions.map((productCondition) => (
        <AppSelectMenuItem
          key={productCondition.id}
          value={productCondition.id}
          selected
        >
          {productCondition.title}
        </AppSelectMenuItem>
      ))}
    </AppSelect>
  );
};

const ProductFilterBar = (props: ProductFilterBarProps) => {
  const {
    className,
    requiredProductCategory,
    disabledProductSort,
    filterValue: controlledFilterValue,
    onFilterValueChange,
    ...rest
  } = props;

  const [filterValue, setFilterValue] = useState<FilterValue>(() => {
    return {
      brands: Array.isArray(controlledFilterValue?.brands)
        ? controlledFilterValue!.brands.map((brand) => ({
            id: brand?.id,
            title: brand?.title,
          }))
        : [],
      product_conditions: Array.isArray(
        controlledFilterValue?.product_conditions
      )
        ? controlledFilterValue!.product_conditions.map((productCondition) => ({
            id: productCondition?.id,
            title: productCondition?.title,
          }))
        : [],
      product_category: controlledFilterValue?.product_category?.id
        ? {
            id: controlledFilterValue?.product_category?.id,
            title: controlledFilterValue?.product_category?.title,
          }
        : null,
      product_sort: controlledFilterValue?.product_sort?.id
        ? {
            id: controlledFilterValue?.product_sort?.id,
            title: controlledFilterValue?.product_sort?.title,
          }
        : null,
      is_post_courier: controlledFilterValue?.is_post_courier,
      is_trade_in_person: controlledFilterValue?.is_trade_in_person,
      max_price: commonHelpers.isNumber(controlledFilterValue?.max_price)
        ? controlledFilterValue?.max_price
        : "",
      min_price: commonHelpers.isNumber(controlledFilterValue?.min_price)
        ? controlledFilterValue?.min_price
        : "",
    };
  });

  const curFilterValueRef = useRef(controlledFilterValue);

  const { t } = useTranslation();

  const { classes, theme, cx } = useStyles();

  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const filtering = useMemo(() => {
    return Object.entries(filterValue).some(([key, value]) => {
      if (key === "product_category" && requiredProductCategory) return false;
      return !commonHelpers.isEmpty(value) && value !== 0;
    });
  }, [filterValue, requiredProductCategory]);

  const setFilterFieldValue = (field: keyof FilterValue, value: any) => {
    const newFilterValue = {
      ...filterValue,
      [field]: value,
    };
    curFilterValueRef.current = newFilterValue;
    setFilterValue(newFilterValue);
    onFilterValueChange && onFilterValueChange(newFilterValue as any);
  };

  const handleFilterValueChange = (newFilterValue: FilterValue) => {
    curFilterValueRef.current = newFilterValue;
    setFilterValue(newFilterValue);
    onFilterValueChange && onFilterValueChange(newFilterValue as any);
  };

  const handleProductCategoryChange: ProductCategoryAutocompleteProps<any>["onChange"] =
    (_, newProductCategories) => {
      setFilterFieldValue("product_category", newProductCategories);
    };
  const handleBrandChange = (_: any, newBrands: any) => {
    setFilterFieldValue("brands", newBrands);
  };

  const handleTradeInPersonChange = (
    _: React.SyntheticEvent,
    checked: boolean
  ) => {
    setFilterFieldValue("is_trade_in_person", checked ? 1 : 0);
  };

  const handlePostCourierChange = (
    _: React.SyntheticEvent,
    checked: boolean
  ) => {
    setFilterFieldValue("is_post_courier", checked ? 1 : 0);
  };

  const handleFilterValueReset = () => {
    const newFilterValue = {
      brands: [],
      product_category: filterValue.product_category,
      product_conditions: [],
      product_sort: null,
      is_post_courier: 0,
      is_trade_in_person: 0,
      max_price: "",
      min_price: "",
    } as FilterValue;
    !requiredProductCategory &&
      Object.assign(newFilterValue, {
        product_category: null,
      });
    setFilterValue(newFilterValue);
    onFilterValueChange && onFilterValueChange(newFilterValue as any);
  };

  useEffect(() => {
    if (!_isEqual(controlledFilterValue, curFilterValueRef.current)) {
      setFilterValue({
        brands: Array.isArray(controlledFilterValue?.brands)
          ? controlledFilterValue!.brands.map((brand) => ({
              id: brand?.id,
              title: brand?.title,
            }))
          : [],
        product_conditions: Array.isArray(
          controlledFilterValue?.product_conditions
        )
          ? controlledFilterValue!.product_conditions.map(
              (productCondition) => ({
                id: productCondition?.id,
                title: productCondition?.title,
              })
            )
          : [],
        product_category: controlledFilterValue?.product_category?.id
          ? {
              id: controlledFilterValue?.product_category?.id,
              title: controlledFilterValue?.product_category?.title,
            }
          : null,
        product_sort: controlledFilterValue?.product_sort?.id
          ? {
              id: controlledFilterValue?.product_sort?.id,
              title: controlledFilterValue?.product_sort?.title,
            }
          : null,
        is_post_courier: controlledFilterValue?.is_post_courier,
        is_trade_in_person: controlledFilterValue?.is_trade_in_person,
        max_price: commonHelpers.isNumber(controlledFilterValue?.max_price)
          ? controlledFilterValue?.max_price
          : "",
        min_price: commonHelpers.isNumber(controlledFilterValue?.min_price)
          ? controlledFilterValue?.min_price
          : "",
      });
    }
  }, [controlledFilterValue]);

  return (
    <ProductFilterBarContext.Provider
      value={{
        filtering,
        filterValue,
        requiredProductCategory: !!requiredProductCategory,
        disabledProductSort: !!disabledProductSort,
        setFilterValue: handleFilterValueChange,
        setFilterFieldValue,
      }}
    >
      <Box
        {...rest}
        className={cx(classes.root, filtering && classes.filtering, className)}
      >
        <ProductCategoryAutocomplete
          className={classes.filterAutocomplete}
          value={filterValue.product_category ?? null}
          limitTags={1}
          disableClearable={!!requiredProductCategory}
          defaultInputProps={{
            placeholder: t("category"),
            borderRadius: "circular",
            borderColor: "text.primary",
            hoverBorderColor: "text.primary",
          }}
          onChange={handleProductCategoryChange}
        />
        {isSmUp && (
          <AsyncAutocomplete
            className={classes.filterAutocomplete}
            module="brands"
            multiple
            limitTags={1}
            value={filterValue.brands ?? []}
            defaultInputProps={{
              placeholder: t("brand"),
              borderRadius: "circular",
              borderColor: "text.primary",
              hoverBorderColor: "text.primary",
            }}
            onChange={handleBrandChange}
          />
        )}
        {isMdUp && !disabledProductSort && <ProductSortSelect />}
        {isMdUp && <SortByPrice />}
        {isLgUp && <ConditionSelect />}
        {isLgUp && (
          <AppFormControlLabel
            label={t("tradeInPerson")}
            control={
              <AppCheckbox
                color="text.primary"
                checked={!!filterValue.is_trade_in_person}
              />
            }
            sx={{ m: 0, whiteSpace: "nowrap" }}
            onChange={handleTradeInPersonChange}
          />
        )}
        {isLgUp && (
          <AppFormControlLabel
            label={t("byPostAndCourier")}
            control={
              <AppCheckbox
                color="text.primary"
                checked={!!filterValue.is_post_courier}
              />
            }
            sx={{ m: 0, whiteSpace: "nowrap" }}
            onChange={handlePostCourierChange}
          />
        )}
        <Divider orientation="vertical" sx={{ height: 22 }} />
        <FilterAll />
        {filtering && (
          <AppButton
            variant="text"
            borderRadius="circular"
            color="common.blue"
            onClick={handleFilterValueReset}
          >
            {t("reset")}
          </AppButton>
        )}
      </Box>
    </ProductFilterBarContext.Provider>
  );
};

export default ProductFilterBar;
