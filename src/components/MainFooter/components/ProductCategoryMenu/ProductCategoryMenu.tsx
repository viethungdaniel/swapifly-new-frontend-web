import { storeProductCategorySelectors } from "@/store";

import { commonHelpers } from "@/utils/helpers";

import {
  Collapse,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppIconButton from "@/components/AppIconButton";
import AppLink from "@/components/AppLink";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemButton from "@/components/AppListItemButton";
import AppListItemText from "@/components/AppListItemText";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTypography from "@/components/AppTypography";

import ArrowDownIcon from "@@/public/images/icons/arrow-down.svg";

import { useMemo, useState } from "react";
import { useAppSelector } from "@/hooks";

import { useRouter } from "next/router";

import useStyles from "./ProductCategoryMenu.styles";

const ProductCategoryMenu = () => {
  const [productCategoryIdToOpenMap, setProductCategoryIdToOpenMap] = useState<{
    [id: number]: boolean;
  }>({});

  const { classes, theme, cx } = useStyles();

  const router = useRouter();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const $s_productCategoriesTrees = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesTrees
  );

  const productCategoryMenus = useMemo(() => {
    return $s_productCategoriesTrees.map((productCategoriesTree) => {
      const allChildProductCategories = [] as Pick<
        (typeof $s_productCategoriesTrees)[number],
        "title" | "id"
      >[];
      const maxLevel = 1;
      const loopChildProductCategories = (
        childProductCategories: typeof $s_productCategoriesTrees,
        level: number
      ) => {
        if (level === maxLevel) return;
        childProductCategories.forEach((productCategory) => {
          allChildProductCategories.push({
            id: productCategory.id,
            title: productCategory.title,
          });
          loopChildProductCategories(
            productCategory.child_product_categories,
            level + 1
          );
        });
      };
      loopChildProductCategories(
        productCategoriesTree.child_product_categories,
        0
      );
      return {
        id: productCategoriesTree.id,
        title: productCategoriesTree.title,
        child_product_categories: allChildProductCategories,
      };
    });
  }, [$s_productCategoriesTrees]);

  const getProductCategoryRouterLink = (id: number, title: string) => {
    return {
      pathname: commonHelpers.generateProductCategorySlug(title, id),
    };
  };

  const handleProductCategoryToggle = (productCategoryId: number) => () => {
    setProductCategoryIdToOpenMap((prevMap) => ({
      ...prevMap,
      [productCategoryId]: !prevMap[productCategoryId],
    }));
  };

  return productCategoryMenus.length > 0 ? (
    <div className={classes.root}>
      {isTabletDown ? (
        <>
          <AppList disablePadding>
            {productCategoryMenus.map((productCategory) => (
              <AppListItem
                classes={{
                  root: cx(
                    classes.mobileProductCategoryItem,
                    !!productCategoryIdToOpenMap[productCategory.id] &&
                      classes.selected
                  ),
                }}
                key={productCategory.id}
                disablePadding
              >
                <div className={classes.mobileProductCategoryItemTitle}>
                  <AppListItemButton
                    sx={{ py: 2 }}
                    onClick={handleProductCategoryToggle(productCategory.id)}
                  >
                    <div
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        router.push(
                          getProductCategoryRouterLink(
                            productCategory.id,
                            productCategory.title
                          )
                        );
                      }}
                    >
                      <AppListItemText
                        primary={productCategory.title || "..."}
                        primaryTypographyProps={{ variant: "bodyMed16" }}
                      />
                    </div>
                  </AppListItemButton>
                  {productCategory.child_product_categories.length > 0 && (
                    <AppIconButton
                      edge={"end"}
                      borderRadius="circular"
                      color="text.primary"
                      disableRipple
                      disableTouchRipple
                      disableHoverEffect
                      className={classes.productCategoryItemCollapseButton}
                    >
                      <AppSvgIcon component={ArrowDownIcon} />
                    </AppIconButton>
                  )}
                </div>
                <Collapse in={!!productCategoryIdToOpenMap[productCategory.id]}>
                  <AppListItem component="div" sx={{ paddingTop: 0 }}>
                    {productCategory.child_product_categories.length > 0 && (
                      <div className={classes.childProductCategoryList}>
                        {productCategory.child_product_categories.map(
                          (childProductCategory) => (
                            <Typography
                              className={classes.childProductCategoryItem}
                              key={childProductCategory.id}
                              variant="bodyReg16"
                              component="div"
                            >
                              <AppLink
                                href={getProductCategoryRouterLink(
                                  childProductCategory.id,
                                  childProductCategory.title
                                )}
                                variant="inherit"
                                underline="none"
                                hoverColor="none"
                              >
                                {childProductCategory.title}
                              </AppLink>
                            </Typography>
                          )
                        )}
                      </div>
                    )}
                  </AppListItem>
                </Collapse>
                <AppListItem
                  component="div"
                  sx={{ py: "0px !important", minHeight: "auto" }}
                >
                  <Divider sx={{ width: "100%" }} />
                </AppListItem>
              </AppListItem>
            ))}
          </AppList>
        </>
      ) : (
        <AppContainer>
          <Grid container spacing={3.75}>
            {productCategoryMenus.map((productCategory) => (
              <Grid
                key={productCategory.id}
                item
                xs={12}
                display="flex"
                flexDirection="column"
                gap={1.25}
              >
                <div>
                  <AppTypography
                    className={classes.productCategoryItemHover}
                    textTransform="uppercase"
                    variant="bodyMed16"
                    component={AppLink}
                    underline="hover"
                    href={getProductCategoryRouterLink(
                      productCategory.id,
                      productCategory.title
                    )}
                  >
                    {productCategory.title || "..."}
                  </AppTypography>
                </div>
                {productCategory.child_product_categories.length > 0 && (
                  <div className={classes.childProductCategoryList}>
                    {productCategory.child_product_categories.map(
                      (childProductCategory) => (
                        <Typography
                          className={classes.childProductCategoryItem}
                          key={childProductCategory.id}
                          variant="bodyReg16"
                          component="div"
                        >
                          <AppLink
                            href={getProductCategoryRouterLink(
                              childProductCategory.id,
                              childProductCategory.title
                            )}
                            variant="inherit"
                            underline="hover"
                            whiteSpace="break-spaces"
                          >
                            {childProductCategory.title}
                          </AppLink>
                        </Typography>
                      )
                    )}
                  </div>
                )}
              </Grid>
            ))}
          </Grid>
        </AppContainer>
      )}
    </div>
  ) : null;
};

export default ProductCategoryMenu;
