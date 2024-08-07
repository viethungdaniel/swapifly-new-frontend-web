import _isEqual from "lodash/isEqual";

import {
  commonHelpers,
  imageHelpers,
  productCategoryHelpers,
} from "@/utils/helpers";
import { storeProductCategorySelectors } from "@/store";

import { ClickAwayListener, Collapse } from "@mui/material";
import AppList from "@/components/AppList";
import AppPaper from "@/components/AppPaper";
import AppListItem from "@/components/AppListItem";
import AppListItemButton from "@/components/AppListItemButton";
import AppListItemIcon from "@/components/AppListItemIcon";
import AppImage from "@/components/AppImage";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppListItemText from "@/components/AppListItemText";
import AppAutocomplete from "@/components/AppAutocomplete";
import AppTextField from "@/components/AppTextField";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AppTypography from "@/components/AppTypography";

import ArrowDownIcon from "@@/public/images/icons/arrow-down.svg";

import { createFilterOptions } from "@mui/material/Autocomplete";

import {
  forwardRef,
  Fragment,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppSelector, useIsMounted } from "@/hooks";

import ProductCategoryAutocompleteContext from "@/containers/ProductCategoryAutocomplete/ProductCategoryAutocomplete.context";

import useStyles from "./ProductCategoryAutocomplete.styles";

import type { ProductCategoriesTrees } from "@/store/productCategory/types";
import type { AppAutocompleteProps } from "@/components/AppAutocomplete";

type CustomProductCategoryAutocompleteProps = {
  selectOnlyLastOption?: boolean;
  showBreadcrumbs?: boolean;
};

export type ProductCategoryAutocompleteProps<
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  ChipComponent extends React.ElementType = "div"
> = Omit<
  AppAutocompleteProps<
    | Partial<ProductCategoriesTrees[number]>
    | Array<Partial<ProductCategoriesTrees[number]>>,
    Multiple,
    DisableClearable,
    true,
    ChipComponent
  >,
  | "options"
  | "PaperComponent"
  | "getOptionLabel"
  | keyof CustomProductCategoryAutocompleteProps
> &
  CustomProductCategoryAutocompleteProps;

const ProductCategoryMenu = memo(
  <P extends ProductCategoriesTrees[number]>(props: {
    productCategories: P[];
    level?: number;
  }) => {
    const { productCategories, level = 0 } = props;

    const [idToCollapseOpenMap, setIdToCollapseOpenMap] = useState<{
      [id: number]: boolean;
    }>({});
    const [idToCollapseShowMap, setIdToCollapseShowMap] = useState<{
      [id: number]: boolean;
    }>({});
    const [focusedCollapseCategoryId, setFocusedCollapseCategoryId] =
      useState<number>();

    const { classes, cx } = useStyles();

    const {
      hasInputValue,
      name,
      disableCloseOnSelect,
      selectOnlyLastOption,
      selectedProductCategoryTree,
      disableClearable,
      onClose,
      onChange,
    } = useContext(ProductCategoryAutocompleteContext);

    const checkProductCategoryId = (productCategoryId: number) => {
      if (Array.isArray(selectedProductCategoryTree)) {
        const productCategoryIdIndex = selectedProductCategoryTree.findIndex(
          (item) => item.id === productCategoryId
        );
        return productCategoryIdIndex > -1;
      }

      return selectedProductCategoryTree?.id === productCategoryId;
    };

    const handleCollapseToggle =
      (categoryId: number) => (event: React.SyntheticEvent) => {
        if (!!hasInputValue) return;
        event.stopPropagation();
        !idToCollapseOpenMap[categoryId] &&
          setIdToCollapseShowMap((prevMap) => ({
            ...prevMap,
            [categoryId]: true,
          }));
        setIdToCollapseOpenMap((prevMap) => ({
          ...prevMap,
          [categoryId]: !prevMap[categoryId],
        }));
        setFocusedCollapseCategoryId(categoryId);
      };

    const handleSelectedProductCategoryChange =
      (productCategory: ProductCategoriesTrees[number]) =>
      (event: React.SyntheticEvent<Element, Event>) => {
        if (Array.isArray(selectedProductCategoryTree)) {
          const newSelectedProductCategoryTree = [
            ...selectedProductCategoryTree,
          ];
          const productCategoryIdIndex =
            newSelectedProductCategoryTree.findIndex(
              (item) => item.id === productCategory.id
            );
          if (productCategoryIdIndex > -1) {
            newSelectedProductCategoryTree.splice(productCategoryIdIndex, 1);
          } else {
            newSelectedProductCategoryTree.push(productCategory);
          }
          onChange &&
            onChange(
              {
                target: {
                  name: name || "",
                  value: newSelectedProductCategoryTree,
                },
              } as any,
              newSelectedProductCategoryTree,
              "selectOption"
            );
          if (!disableCloseOnSelect) {
            onClose && onClose(event, "selectOption");
          }
          return;
        }
        const newSelectedProductCategoryTree =
          productCategory.id === selectedProductCategoryTree?.id &&
          !disableClearable
            ? null
            : { ...productCategory };

        onChange &&
          onChange(
            {
              target: {
                name: name || "",
                value: newSelectedProductCategoryTree,
              },
            } as any,
            newSelectedProductCategoryTree,
            "selectOption"
          );

        if (!disableCloseOnSelect) {
          onClose && onClose(event, "selectOption");
        }
      };

    const handleProductCategoryTreeClick =
      (productCategory: ProductCategoriesTrees[number]) =>
      (event: React.SyntheticEvent) => {
        if (
          !selectOnlyLastOption ||
          (selectOnlyLastOption &&
            productCategory.child_product_categories.length < 1)
        ) {
          handleSelectedProductCategoryChange(productCategory)(event);
          return;
        }
        handleCollapseToggle(productCategory.id)(event);
      };

    useEffect(() => {
      if (!isMounted()) return;
      !idToCollapseOpenMap[focusedCollapseCategoryId!] &&
        !commonHelpers.isEmpty(focusedCollapseCategoryId) &&
        setIdToCollapseShowMap((prevMap) => ({
          ...prevMap,
          [focusedCollapseCategoryId!]: false,
        }));
    }, [focusedCollapseCategoryId]);

    const isMounted = useIsMounted();

    return (
      <AppList
        className={cx(!level && classes.productCategoryList)}
        disablePadding={!!level}
        sx={(theme) => ({
          backgroundColor: !!level
            ? theme.palette.common.lightestNeutral
            : undefined,
        })}
      >
        {productCategories.map((productCategory) => {
          const selected = checkProductCategoryId(productCategory.id);
          return (
            <Fragment key={productCategory.id}>
              <AppListItem
                disablePadding
                // className={cx(
                //   checkProductCategoryId(productCategory.id) && "Mui-selected"
                // )}
                selected={selected}
              >
                <AppListItemButton
                  disableRipple
                  style={{
                    paddingLeft: !!level
                      ? 40 + (40 / 2 + 8) * level
                      : undefined,
                  }}
                  onClick={handleProductCategoryTreeClick(productCategory)}
                >
                  {!level && (
                    <AppListItemIcon className={classes.categoryItemImage}>
                      {!productCategory.pid && (
                        <AppImage
                          src={productCategory.background}
                          loader={imageHelpers.appImageLoader}
                          alt={productCategory.title}
                          fill
                          sizes="40px"
                          objectFit="contain"
                          objectPosition="center"
                          defaultPlaceholderVariant="default"
                        />
                      )}
                    </AppListItemIcon>
                  )}
                  <AppListItemText
                    primary={productCategory.title || "..."}
                    primaryTypographyProps={{
                      color: selected ? "primary.main" : "text.primary",
                      variant: selected ? "bodyMed14" : "bodyReg14",
                      lineHeight: "20px",
                    }}
                  />
                  {(productCategory.child_product_categories?.length || 0) >
                    0 && (
                    <span
                      className={cx(
                        classes.toggleAction,
                        (hasInputValue ||
                          !idToCollapseOpenMap[productCategory.id]) &&
                          classes.active
                      )}
                      onClick={handleCollapseToggle(productCategory.id)}
                    >
                      <AppSvgIcon
                        className={classes.toggleActionIcon}
                        component={ArrowDownIcon}
                      />
                    </span>
                  )}
                </AppListItemButton>
              </AppListItem>
              {(productCategory.child_product_categories?.length || 0) > 0 && (
                <Collapse
                  in={
                    hasInputValue || !!idToCollapseOpenMap[productCategory.id]
                  }
                >
                  <li>
                    {(hasInputValue ||
                      idToCollapseShowMap[productCategory.id]) && (
                      <ProductCategoryMenu
                        productCategories={
                          productCategory!.child_product_categories
                        }
                        level={level + 1}
                      />
                    )}
                  </li>
                </Collapse>
              )}
            </Fragment>
          );
        })}
        {productCategories.length < 1 && (
          <AppListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
            <AppListItemText primary={"No data"} />
          </AppListItem>
        )}
      </AppList>
    );
  }
);

const ProductCategoryPaper = forwardRef(
  (props: any, ref: React.ForwardedRef<any>) => {
    const { productCategoriesTrees } = useContext(
      ProductCategoryAutocompleteContext
    );

    return (
      <AppPaper
        ref={ref}
        {...props}
        boxShadowVariant="menuPopper"
        sx={{ minWidth: 240 }}
      >
        <ProductCategoryMenu productCategories={productCategoriesTrees} />
      </AppPaper>
    );
  }
);

const ProductCategoryAutocomplete = forwardRef(
  <
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    ChipComponent extends React.ElementType = "div"
  >(
    props: ProductCategoryAutocompleteProps<
      Multiple,
      DisableClearable,
      ChipComponent
    >,
    ref: React.ForwardedRef<any>
  ) => {
    const {
      name,
      selectOnlyLastOption,
      value,
      open: controlledOpen,
      disableCloseOnSelect,
      componentsProps,
      defaultInputProps,
      showBreadcrumbs,
      disableClearable,
      onChange,
      onOpen,
      onClose,
      onBlur,
      onInputChange,
      ...rest
    } = props;

    const [inputValue, setInputValue] = useState("");
    const [autocompleteInputValue, setAutocompleteInputValue] = useState(
      rest.multiple ? "" : (value as any)?.title ?? ""
    );
    const [autocompleteOpen, setAutocompleteOpen] = useState(!!controlledOpen);

    const curValueRef = useRef(value);
    const autocompletePaperRef = useRef<HTMLDivElement>();

    const $s_productCategories = useAppSelector(
      storeProductCategorySelectors.selectProductCategories
    );
    const $s_breadcrumbProductCategories = useAppSelector((state) =>
      storeProductCategorySelectors.selectBreadcrumbProductCategories(
        state,
        showBreadcrumbs && !rest.multiple ? (value as any)?.id ?? null : null
      )
    );

    const { cx } = useStyles();

    const filterProductCategories = useMemo(
      () =>
        createFilterOptions({
          matchFrom: "any",
          stringify: (option: any) => option.title,
          limit: $s_productCategories.length,
        }),
      [$s_productCategories]
    );

    const productCategoriesTrees = useMemo(() => {
      let newsProductCategories = filterProductCategories(
        $s_productCategories,
        {
          inputValue,
          getOptionLabel: (option: any) => option.title || "",
        }
      );
      if (selectOnlyLastOption && !!inputValue) {
        newsProductCategories = newsProductCategories.filter(
          (item) => item.is_last_product_category
        );
      }
      return productCategoryHelpers.mapListToTreeList(newsProductCategories);
    }, [$s_productCategories, inputValue, filterProductCategories]);

    const handleAutocompleteClose: AppAutocompleteProps<any>["onClose"] = (
      event,
      reason
    ) => {
      if (reason !== "blur") {
        setAutocompleteInputValue(
          rest.multiple ? "" : (value as any)?.title || ""
        );
        setAutocompleteOpen(false);
        setInputValue("");
        onClose && onClose(event, reason);
      }
    };

    const handleAutocompleteInputChange: AppAutocompleteProps<any>["onInputChange"] =
      (event, value, mode) => {
        onInputChange && onInputChange(event, value, mode);
        if (mode !== "reset") {
          setAutocompleteInputValue(value);
          setInputValue(value);
        }
        if (mode === "clear") {
          onChange &&
            onChange(
              {
                target: {
                  name: name ?? "",
                  value: !!rest.multiple ? [] : null,
                },
              } as any,
              (!!rest.multiple ? [] : null) as any,
              mode
            );
        }
      };

    const handleAutocompleteChange: AppAutocompleteProps<any>["onChange"] = (
      event,
      newValue,
      reason
    ) => {
      curValueRef.current = newValue;
      onChange && onChange(event, newValue, reason);
      setInputValue("");
      setAutocompleteInputValue(rest.multiple ? "" : newValue?.title || "");
    };

    useEffect(() => {
      if (
        typeof controlledOpen !== "undefined" &&
        controlledOpen !== autocompleteOpen
      ) {
        setAutocompleteOpen(controlledOpen);
      }
    }, [controlledOpen]);

    useEffect(() => {
      if (!_isEqual(value, curValueRef.current)) {
        curValueRef.current = value as any;
        setAutocompleteInputValue((value as any)?.title ?? "");
      }
    }, [value]);

    return (
      <ProductCategoryAutocompleteContext.Provider
        value={{
          // hasInputValue: !!autocompleteInputValue,
          hasInputValue: !!inputValue,
          disableCloseOnSelect,
          disableClearable,
          name: name || "",
          selectOnlyLastOption,
          selectedProductCategoryTree: value as any,
          productCategoriesTrees,
          onChange: handleAutocompleteChange as any,
          onClose: handleAutocompleteClose,
        }}
      >
        <ClickAwayListener
          onClickAway={(event: any) => {
            if (
              autocompletePaperRef.current &&
              autocompletePaperRef.current.contains(event.target)
            )
              return;
            handleAutocompleteClose(event, "escape");
          }}
        >
          <AppAutocomplete
            {...(rest as any)}
            ref={ref}
            disableCloseOnSelect
            disableClearable={disableClearable}
            inputValue={autocompleteInputValue}
            onInputChange={handleAutocompleteInputChange}
            options={[]}
            PaperComponent={ProductCategoryPaper}
            componentsProps={{
              ...componentsProps,
              paper: {
                ...componentsProps?.paper,
                ref: autocompletePaperRef as any,
              },
            }}
            renderInput={({ InputProps, ...restParams }) => (
              <AppTextField
                {...(restParams as any)}
                name={name}
                onBlur={onBlur ? (onBlur as any) : () => {}}
                {...defaultInputProps}
                formHelperTextProps={{
                  component: "div",
                  ...defaultInputProps?.formHelperTextProps,
                }}
                helperText={
                  ($s_breadcrumbProductCategories.length > 1 ||
                    defaultInputProps?.helperText) && (
                    <>
                      {$s_breadcrumbProductCategories.length > 1 && (
                        <AppBreadcrumbs
                          separator={
                            <AppTypography
                              color="text.secondary"
                              component="span"
                            >
                              /
                            </AppTypography>
                          }
                        >
                          {$s_breadcrumbProductCategories.map(
                            (
                              breadcrumbProductCategory,
                              breadcrumbProductCategoryIndex
                            ) => (
                              <AppTypography
                                color={
                                  breadcrumbProductCategoryIndex !==
                                  $s_breadcrumbProductCategories.length - 1
                                    ? "text.secondary"
                                    : "text.primary"
                                }
                                key={breadcrumbProductCategory.id}
                                sx={{
                                  cursor:
                                    !selectOnlyLastOption &&
                                    breadcrumbProductCategoryIndex !==
                                      $s_breadcrumbProductCategories.length - 1
                                      ? "pointer"
                                      : "auto",
                                }}
                                onClick={
                                  !selectOnlyLastOption
                                    ? () =>
                                        handleAutocompleteChange(
                                          {
                                            target: {
                                              name: name ?? "",
                                              value: breadcrumbProductCategory,
                                            },
                                          },
                                          breadcrumbProductCategory,
                                          "selectOption"
                                        )
                                    : () => {}
                                }
                              >
                                {breadcrumbProductCategory.title}
                              </AppTypography>
                            )
                          )}
                        </AppBreadcrumbs>
                      )}
                      {defaultInputProps?.helperText}
                    </>
                  )
                }
                onClick={(event) => {
                  (InputProps as any).onClick(event);
                  defaultInputProps?.onClick &&
                    defaultInputProps.onClick(event);
                }}
                ref={(textFieldRef: any) => {
                  (InputProps as any).ref(textFieldRef);
                  if (!!defaultInputProps?.ref)
                    (defaultInputProps as any).ref(textFieldRef);
                }}
                classes={{
                  root: cx(InputProps.className, defaultInputProps?.className),
                }}
                startAdornment={
                  defaultInputProps?.startAdornment ? (
                    <>
                      {defaultInputProps.startAdornment}
                      {InputProps.startAdornment}
                    </>
                  ) : (
                    InputProps.startAdornment
                  )
                }
                endAdornment={
                  defaultInputProps?.endAdornment ? (
                    <>
                      {defaultInputProps.endAdornment}
                      {InputProps.endAdornment}
                    </>
                  ) : (
                    InputProps.endAdornment
                  )
                }
              />
            )}
            value={value}
            onChange={onChange}
            getOptionLabel={(option: ProductCategoriesTrees[number]) =>
              option?.title
            }
            open={autocompleteOpen}
            onOpen={(event) => {
              onOpen && onOpen(event);
              setAutocompleteOpen(true);
            }}
            onClose={handleAutocompleteClose}
          />
        </ClickAwayListener>
      </ProductCategoryAutocompleteContext.Provider>
    );
  }
);

export default ProductCategoryAutocomplete;
