import _take from "lodash/take";

import { storeProductCategorySelectors } from "@/store";
import { commonHelpers } from "@/utils/helpers";

import {
  ButtonBase,
  ClickAwayListener,
  Grow,
  Popper,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";

import AppSvgIcon from "@/components/AppSvgIcon";
import AppMenuItem from "@/components/AppMenuItem";
import AppMenuList from "@/components/AppMenuList";
import PopperScrollingPaper from "@/components/PopperScrollingPaper";
import ProductCategoryListDrawer from "@/containers/ProductCategoryListDrawer";

import MoreHorizIcon from "@@/public/images/icons/more-horiz.svg";

import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/hooks";

import useStyles from "./ProductCategoryMenuList.styles";

import type { ProductCategories } from "@/store/productCategory/types";

type ProductCategoryListDrawerProps = React.ComponentProps<
  typeof ProductCategoryListDrawer
>;

const MoreMenuButton = <P extends ProductCategories[number]>(props: {
  productCategories: P[];
  onProductCategoryClick: (productCategory: P) => () => void;
}) => {
  const { productCategories, onProductCategoryClick } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = !!anchorEl;

  const { classes, theme } = useStyles();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = (event: React.SyntheticEvent) => {
    if (anchorEl && anchorEl.contains(event.target as any)) return;
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonBase className={classes.menuItem} onClick={handleToggle}>
        <AppSvgIcon component={MoreHorizIcon} fontSize="small" />
      </ButtonBase>
      <Popper
        anchorEl={anchorEl}
        open={open}
        placement="bottom-end"
        transition
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [-30 + 2, 4],
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
          <ClickAwayListener onClickAway={handleClose as any}>
            <Grow
              {...TransitionProps}
              timeout={theme.transitions.duration.shortest}
              style={{ transformOrigin: "100% 0 0" }}
            >
              <PopperScrollingPaper boxShadowVariant="menuPopper">
                <AppMenuList autoFocus>
                  {productCategories.map(
                    (productCategory, productCategoryIndex) => (
                      <AppMenuItem
                        key={productCategoryIndex}
                        onClick={(event) => {
                          handleClose(event);
                          onProductCategoryClick(productCategory)();
                        }}
                      >
                        {productCategory?.title || "..."}
                      </AppMenuItem>
                    )
                  )}
                </AppMenuList>
              </PopperScrollingPaper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

const ProductCategoryMenuList = () => {
  const { classes, theme, cx } = useStyles();

  const router = useRouter();

  const [productCategoryListDrawerOpen, setProductCategoryListDrawerOpen] =
    useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState<
    (typeof $s_productCategoriesTrees)[number] | null
  >(null);

  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const outsideMenuCount = isMdDown ? 4 : isLgDown ? 5 : 6;

  const $s_productCategoriesTrees = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesTrees
  );
  const $s_productCategoriesLoading = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesLoading
  );
  const $s_productCategoriesError = useAppSelector(
    storeProductCategorySelectors.selectProductCategoriesError
  );

  const outsideProductCategories = useMemo(() => {
    if ($s_productCategoriesLoading || $s_productCategoriesError)
      return [...Array.from(Array(outsideMenuCount)).keys()].map(() => null);
    return _take(
      [...$s_productCategoriesTrees],
      $s_productCategoriesTrees.length - outsideMenuCount >= 2
        ? outsideMenuCount
        : outsideMenuCount + 1
    );
  }, [
    outsideMenuCount,
    $s_productCategoriesTrees,
    $s_productCategoriesLoading,
    $s_productCategoriesError,
  ]);

  const popperMenuProductCategories = useMemo(() => {
    const results = [...$s_productCategoriesTrees];
    results.splice(
      0,
      $s_productCategoriesTrees.length - outsideMenuCount >= 2
        ? outsideMenuCount
        : outsideMenuCount + 1
    );
    return results;
  }, [outsideMenuCount, $s_productCategoriesTrees]);

  const handleProductCategoryClick =
    (productCategory: typeof selectedProductCategory) => () => {
      setSelectedProductCategory(productCategory);
      setProductCategoryListDrawerOpen(true);
    };

  const handleProductCategoryListDrawerClose = () => {
    setProductCategoryListDrawerOpen(false);
  };

  const handleProductCategoryListDrawerChange: ProductCategoryListDrawerProps["onChange"] =
    (_, productCategory) => {
      router.push({
        pathname: !!productCategory
          ? `/${commonHelpers.generateProductCategorySlug(
              productCategory?.title,
              productCategory?.id
            )}`
          : "/search",
      });
    };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.menuList}>
          {outsideProductCategories.map(
            (productCategory, productCategoryIndex) => (
              <Typography
                key={productCategoryIndex}
                className={cx(classes.menuItem, classes.menuItemText)}
                variant="bodyMed16"
                noWrap
                component={ButtonBase}
                disableRipple={!productCategory}
                disableTouchRipple={!productCategory}
                onClick={
                  !!productCategory
                    ? handleProductCategoryClick(productCategory)
                    : () => {}
                }
              >
                {!!productCategory ? (
                  productCategory.title
                ) : (
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{ width: 120, maxWidth: "100%" }}
                  />
                )}
              </Typography>
            )
          )}
          {popperMenuProductCategories.length > 0 && (
            <MoreMenuButton
              productCategories={popperMenuProductCategories}
              onProductCategoryClick={handleProductCategoryClick}
            />
          )}
        </div>
      </div>
      <ProductCategoryListDrawer
        open={productCategoryListDrawerOpen}
        productCategory={selectedProductCategory}
        onClose={handleProductCategoryListDrawerClose}
        onChange={handleProductCategoryListDrawerChange}
      />
    </>
  );
};

export default ProductCategoryMenuList;
