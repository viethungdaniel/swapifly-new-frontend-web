import { imageHelpers } from "@/utils/helpers";
import { storeProductCategorySelectors } from "@/store";

import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Collapse, Divider, Typography } from "@mui/material";
import AppDrawer from "@/components/AppDrawer";
import AppDrawerTitle from "@/components/AppDrawerTitle";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppDrawerBody from "@/components/AppDrawerBody";
import AppIconButton from "@/components/AppIconButton";
import AppList from "@/components/AppList";
import AppListItemButton from "@/components/AppListItemButton";
import AppListItemText from "@/components/AppListItemText";
import AppImage from "@/components/AppImage";
import LoadingOverlay from "@/components/LoadingOverlay";
import AppDrawerTitleText from "@/components/AppDrawerTitleText";
import AppDrawerTitleIcon from "@/components/AppDrawerTitleIcon";

import CloseIcon from "@@/public/images/icons/close.svg";
import ArrowDownIcon from "@@/public/images/icons/arrow-down.svg";
import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector, useIsomorphicLayoutEffect } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./ProductCategoryListDrawer.styles";

import type { ProductCategoriesTrees } from "@/store/productCategory/types";

type OpenedChildProductCategory = ProductCategoriesTrees[number];

type ProductCategoryListDrawerProps = {
  open?: boolean;
  onClose?: (event: React.SyntheticEvent) => void;
  productCategory?: Partial<ProductCategoriesTrees[number]> | null;
  onChange?: (
    event: React.SyntheticEvent,
    productCategory: Partial<ProductCategoriesTrees[number] | null>
  ) => void;
};

const ProductCategoryList = (props: ProductCategoryListDrawerProps) => {
  const {
    open,
    productCategory: controlledProductCategory,
    onChange = () => {},
    onClose = () => {},
  } = props;

  const [idToCollapseOpenMap, setIdToCollapseOpenMap] = useState<{
    [id: number]: boolean;
  }>({});
  const [openedChildProductCategory, setOpenedChildProductCategory] =
    useState<OpenedChildProductCategory | null>(null);
  const [openedChildProductCategories, setOpenedChildProductCategories] =
    useState<OpenedChildProductCategory[]>([]);

  const [highLightedProductCategoryId, setHighLightedProductCategoryId] =
    useState<number | null>(null);

  const [cssTransitionClassNames, setCssTransitionClassNames] = useState<{
    enter: string;
    exit: string;
  }>({
    enter:
      "animate__animated animate__fadeInRight animate__switch-medium__duration",
    exit: "animate__animated animate__fadeOutLeft animate__switch-medium__duration",
  });

  const categoryListElRef = useRef<HTMLUListElement>(undefined!);
  const idToProductCategoryItemElMapRef = useRef<{
    [id: number]: HTMLDivElement;
  }>({});
  const titleElRef = useRef<HTMLDivElement>(undefined!);

  const { t } = useTranslation();

  const $s_productCategories = useAppSelector(
    storeProductCategorySelectors.selectProductCategories
  );
  const $s_productCategoriesLoading = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesLoading
  );
  const $s_productCategoriesError = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesError
  );

  const $s_productCategoriesTrees = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesTrees
  );
  const $s_idToProductCategoriesTreesMap = useAppSelector(
    storeProductCategorySelectors.selectIdToProductCategoriesTreesMap
  );

  const menuProductCategoriesTrees = useMemo(() => {
    if (!!openedChildProductCategory)
      return openedChildProductCategory.child_product_categories;
    return $s_productCategoriesTrees;
  }, [$s_productCategoriesTrees, openedChildProductCategory]);

  const { classes, cx } = useStyles();

  const handleCollapseToggle =
    (productCategoryId: number) => (event: React.SyntheticEvent) => {
      event.stopPropagation();
      setIdToCollapseOpenMap((prevIdToCollapseOpenMap) => ({
        ...prevIdToCollapseOpenMap,
        [productCategoryId]: !prevIdToCollapseOpenMap[productCategoryId],
      }));
    };

  const handleChildMenuProductCategoriesTreeOpen =
    (productCategoryId: number) => (event: React.SyntheticEvent) => {
      event.stopPropagation();
      setCssTransitionClassNames({
        enter:
          "animate__animated animate__fadeInRight animate__switch-medium__duration",
        exit: "animate__animated animate__fadeOutLeft animate__switch-medium__duration",
      });
      setTimeout(() => {
        const childMenuProductCategoriesTree =
          $s_idToProductCategoriesTreesMap[productCategoryId];
        setOpenedChildProductCategory(childMenuProductCategoriesTree);
        setOpenedChildProductCategories((prevOpenedChildProductCategories) => [
          ...prevOpenedChildProductCategories,
          childMenuProductCategoriesTree,
        ]);
      });
    };

  const handleMenuProductCategoriesTreeBack = () => {
    setCssTransitionClassNames({
      enter:
        "animate__animated animate__fadeInLeft animate__switch-medium__duration",
      exit: "animate__animated animate__fadeOutRight animate__switch-medium__duration",
    });
    setHighLightedProductCategoryId(null);
    setTimeout(() => {
      const newOpenedChildProductCategories = [...openedChildProductCategories];
      newOpenedChildProductCategories.splice(-1);
      setOpenedChildProductCategories(newOpenedChildProductCategories);
      setOpenedChildProductCategory(
        [...newOpenedChildProductCategories].reverse()[0]
      );
    });
  };

  const handleProductCategoryChange =
    (productCategory: (typeof menuProductCategoriesTrees)[number] | null) =>
    (event: React.MouseEvent) => {
      onChange(event, productCategory);
      onClose(event);
    };

  useEffect(() => {
    let newIdToCollapseOpenMap: typeof idToCollapseOpenMap = {};
    let newOpenedChildProductCategory: typeof openedChildProductCategory = null;
    let newOpenedChildProductCategories: typeof openedChildProductCategories =
      [];
    const loopProductCategory = (productCategoryId?: number) => {
      const productCategory =
        $s_idToProductCategoriesTreesMap[productCategoryId!];
      if (!!productCategory) {
        newIdToCollapseOpenMap[productCategory.id] =
          productCategory.child_product_categories.length > 0;
        const parentProductCategory =
          $s_idToProductCategoriesTreesMap[productCategory.pid];
        if (
          !newOpenedChildProductCategory &&
          !!parentProductCategory &&
          productCategory.child_product_categories.length > 0
        ) {
          newOpenedChildProductCategory = parentProductCategory;
        }
        if (
          !!parentProductCategory &&
          productCategory.child_product_categories.length > 0
        ) {
          newOpenedChildProductCategories.unshift(parentProductCategory);
        }
        !!parentProductCategory &&
          loopProductCategory(parentProductCategory.id);
      }
    };
    loopProductCategory(controlledProductCategory?.id);
    setIdToCollapseOpenMap(newIdToCollapseOpenMap);
    setOpenedChildProductCategory(newOpenedChildProductCategory);
    setOpenedChildProductCategories(newOpenedChildProductCategories);
    setHighLightedProductCategoryId(controlledProductCategory?.id || null);
  }, [
    open,
    controlledProductCategory?.id,
    $s_productCategories,
    $s_idToProductCategoriesTreesMap,
  ]);

  useIsomorphicLayoutEffect(() => {
    const productCategoryItemEl =
      idToProductCategoryItemElMapRef.current[
        highLightedProductCategoryId as number
      ];
    if (!!productCategoryItemEl) {
      productCategoryItemEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highLightedProductCategoryId]);

  return (
    <>
      <AppDrawerTitle stickyHeader>
        {openedChildProductCategories.length > 0 && (
          <AppDrawerTitleIcon position="start">
            <AppIconButton
              className={classes.titleIconButton}
              color="text.primary"
              borderRadius="circular"
              edge={"xy"}
              onClick={handleMenuProductCategoriesTreeBack}
            >
              <AppSvgIcon component={ArrowLeftIcon} fontSize="inherit" />
            </AppIconButton>
          </AppDrawerTitleIcon>
        )}

        <AppDrawerTitleText>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={openedChildProductCategory?.id || "all"}
              nodeRef={titleElRef}
              addEndListener={(done) => {
                titleElRef.current.addEventListener(
                  "animationend",
                  done,
                  false
                );
              }}
              classNames={cssTransitionClassNames}
            >
              <span ref={titleElRef}>
                {!!openedChildProductCategory
                  ? openedChildProductCategory.title
                  : t("categories")}
              </span>
            </CSSTransition>
          </SwitchTransition>
        </AppDrawerTitleText>
        <AppDrawerTitleIcon position="end">
          <AppIconButton
            className={classes.titleIconButton}
            color="text.primary"
            edge={"xy"}
            borderRadius="circular"
            onClick={onClose}
          >
            <AppSvgIcon component={CloseIcon} />
          </AppIconButton>
        </AppDrawerTitleIcon>
      </AppDrawerTitle>
      <AppDrawerBody disablePadding>
        <LoadingOverlay
          loading={$s_productCategoriesLoading || !!$s_productCategoriesError}
        >
          {$s_productCategoriesTrees.length > 0 ? (
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={openedChildProductCategory?.id || "all"}
                nodeRef={categoryListElRef}
                addEndListener={(done) => {
                  categoryListElRef.current.addEventListener(
                    "animationend",
                    done,
                    false
                  );
                }}
                classNames={cssTransitionClassNames}
              >
                <AppList ref={categoryListElRef} disablePadding>
                  {!openedChildProductCategory && (
                    <>
                      <AppListItemButton
                        className={classes.productCategoryItem}
                        disableGutters
                        disableRipple
                        onClick={handleProductCategoryChange(null)}
                      >
                        <AppListItemText
                          primary={t("all")}
                          primaryTypographyProps={{ variant: "titleSemi20" }}
                        />
                        <div className={classes.productCategoryItemPhoto}></div>
                      </AppListItemButton>
                      <Divider />
                    </>
                  )}
                  {menuProductCategoriesTrees.map(
                    (
                      menuProductCategoriesTree,
                      menuProductCategoriesTreeIndex
                    ) => (
                      <Fragment key={menuProductCategoriesTree.id}>
                        {menuProductCategoriesTreeIndex !== 0 && <Divider />}
                        <AppListItemButton
                          className={cx(
                            classes.productCategoryItem,
                            !!idToCollapseOpenMap[
                              menuProductCategoriesTree.id
                            ] && classes.active
                          )}
                          ref={(ele: any) => {
                            idToProductCategoryItemElMapRef.current[
                              menuProductCategoriesTree.id
                            ] = ele;
                          }}
                          selected={
                            highLightedProductCategoryId ===
                            menuProductCategoriesTree.id
                          }
                          disableGutters
                          disableRipple
                          onClick={handleProductCategoryChange(
                            menuProductCategoriesTree
                          )}
                        >
                          <AppListItemText
                            primary={menuProductCategoriesTree.title || "..."}
                            primaryTypographyProps={
                              !openedChildProductCategory
                                ? {
                                    variant: "titleSemi20",
                                  }
                                : {}
                            }
                          />
                          {!openedChildProductCategory && (
                            <div className={classes.productCategoryItemPhoto}>
                              <AppImage
                                src={menuProductCategoriesTree.background}
                                loader={imageHelpers.appImageLoader}
                                alt={menuProductCategoriesTree.title}
                                objectFit={"contained"}
                                objectPosition={"center"}
                                fill
                                sizes="100px"
                                defaultPlaceholderVariant="default"
                              />
                            </div>
                          )}
                          {(menuProductCategoriesTree?.child_product_categories
                            ?.length || 0) > 0 && (
                            <div className={classes.toggle}>
                              <AppIconButton
                                edge={["x"]}
                                borderRadius={"circular"}
                                color="text.primary"
                                className={classes.toggleButton}
                                onClick={handleCollapseToggle(
                                  menuProductCategoriesTree.id
                                )}
                              >
                                <AppSvgIcon
                                  component={ArrowDownIcon}
                                  fontSize="inherit"
                                />
                              </AppIconButton>
                            </div>
                          )}
                        </AppListItemButton>
                        {(menuProductCategoriesTree?.child_product_categories
                          ?.length || 0) > 0 && (
                          <Collapse
                            in={
                              !!idToCollapseOpenMap[
                                menuProductCategoriesTree.id
                              ]
                            }
                          >
                            <AppList disablePadding>
                              {menuProductCategoriesTree.child_product_categories.map(
                                (childMenuProductCategoriesTree) => (
                                  <Fragment
                                    key={childMenuProductCategoriesTree.id}
                                  >
                                    <Divider
                                      className={
                                        classes.childProductCategoryDivider
                                      }
                                    />
                                    <AppListItemButton
                                      className={cx(
                                        classes.productCategoryItem,
                                        classes.childProductCategoryItem
                                      )}
                                      selected={
                                        highLightedProductCategoryId ===
                                        childMenuProductCategoriesTree.id
                                      }
                                      disableGutters
                                      disableRipple
                                      ref={(ele: any) => {
                                        idToProductCategoryItemElMapRef.current[
                                          childMenuProductCategoriesTree.id
                                        ] = ele;
                                      }}
                                      onClick={handleProductCategoryChange(
                                        childMenuProductCategoriesTree
                                      )}
                                    >
                                      <AppListItemText
                                        primary={
                                          childMenuProductCategoriesTree.title ||
                                          "..."
                                        }
                                      />
                                      {(childMenuProductCategoriesTree
                                        .child_product_categories?.length ||
                                        0) > 0 && (
                                        <div className={classes.toggle}>
                                          <AppIconButton
                                            edge={["x"]}
                                            borderRadius={"circular"}
                                            color="text.primary"
                                            className={classes.toggleButton}
                                            onClick={handleChildMenuProductCategoriesTreeOpen(
                                              childMenuProductCategoriesTree.id
                                            )}
                                          >
                                            <AppSvgIcon
                                              component={ArrowDownIcon}
                                              fontSize="inherit"
                                            />
                                          </AppIconButton>
                                        </div>
                                      )}
                                    </AppListItemButton>
                                  </Fragment>
                                )
                              )}
                            </AppList>
                          </Collapse>
                        )}
                      </Fragment>
                    )
                  )}
                </AppList>
              </CSSTransition>
            </SwitchTransition>
          ) : (
            <Typography
              className={classes.noProductCategories}
              align="center"
              color="textSecondary"
            >
              {t("noResults")}
            </Typography>
          )}
          {$s_productCategoriesError &&
            $s_productCategoriesTrees.length < 1 && (
              <Typography
                className={classes.noProductCategories}
                align="center"
                color="error.main"
              >
                {$s_productCategoriesError}
              </Typography>
            )}
        </LoadingOverlay>
      </AppDrawerBody>
    </>
  );
};

const ProductCategoryListDrawer = (props: ProductCategoryListDrawerProps) => {
  const { open, onClose = () => {} } = props;

  return (
    <AppDrawer open={!!open} onClose={onClose as any}>
      <ProductCategoryList {...props} />
    </AppDrawer>
  );
};

export default ProductCategoryListDrawer;
