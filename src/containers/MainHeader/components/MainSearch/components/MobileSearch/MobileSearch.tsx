import { storeProductCategorySelectors } from "@/store";

import { Divider, Typography } from "@mui/material";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTextField from "@/components/AppTextField";
import AppIconButton from "@/components/AppIconButton";
import AppDrawer from "@/components/AppDrawer";
import AppDrawerTitle from "@/components/AppDrawerTitle";
import AppDrawerBody from "@/components/AppDrawerBody";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemText from "@/components/AppListItemText";
import AppListItemButton from "@/components/AppListItemButton";
import ProductCategoryListDrawer from "@/containers/ProductCategoryListDrawer";
import AppListItemIcon from "@/components/AppListItemIcon";

import MainSearchContext from "@/containers/MainHeader/components/MainSearch/MainSearch.context";
import MainHeaderContext from "@/containers/MainHeader/MainHeader.context";

import SearchIcon from "@@/public/images/icons/search.svg";
import CloseIcon from "@@/public/images/icons/close.svg";
import HistoryIcon from "@@/public/images/icons/history.svg";
import UserCircleIcon from "@@/public/images/icons/user-circle.svg";
import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";
import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import { useContext, useMemo, useRef, useState } from "react";
import { useAppSelector, useIsomorphicLayoutEffect } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./MobileSearch.styles";

const MobileSearch = () => {
  const {
    search,
    searchInput,
    optionMenus,
    histories,
    submitSearch,
    handleSearchChange: onSearchChange,
    handleProductCategoryChange,
    handleHistoryRemove,
    handleHistoryClear,
  } = useContext(MainSearchContext);

  const { selectedProductCategoryId } = useContext(MainHeaderContext);

  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [productCategoryListDrawerOpen, setProductCategoryListDrawerOpen] =
    useState(false);

  const $s_idToProductCategoriesTreesMap = useAppSelector(
    storeProductCategorySelectors.selectIdToProductCategoriesTreesMap
  );

  const selectedProductCategory = useMemo(() => {
    if (!selectedProductCategoryId) return null;
    return (
      $s_idToProductCategoriesTreesMap[selectedProductCategoryId as any] || null
    );
  }, [selectedProductCategoryId, $s_idToProductCategoriesTreesMap]);

  const { classes } = useStyles();

  const searchInputRef = useRef<HTMLInputElement>();

  const { t } = useTranslation();

  const handleSearchDrawerOpen = () => {
    setSearchDrawerOpen(true);
  };

  const handleSearchDrawerClose = () => {
    setSearchDrawerOpen(false);
  };

  const handleProductCategoryListDrawerClose = () => {
    setProductCategoryListDrawerOpen(false);
  };

  const handleProductCategoryListDrawerOpen = () => {
    setProductCategoryListDrawerOpen(true);
  };

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setSearchDrawerOpen(false);
    submitSearch();
  };

  const handleOptionMenuClick =
    (optionMenu: (typeof optionMenus)[number]) => () => {
      submitSearch(optionMenu);
      setSearchDrawerOpen(false);
    };

  useIsomorphicLayoutEffect(() => {
    searchInputRef.current && searchInputRef.current.focus();
  }, [searchDrawerOpen]);

  return (
    <>
      <AppTextField
        fullWidth
        classes={{
          root: classes.searchTextField,
        }}
        readOnly
        autoComplete="off"
        borderRadius="circular"
        placeholder={search || `${t("searchItems")}...`}
        endAdornment={
          <AppInputAdornment position="end">
            <AppSvgIcon component={SearchIcon} />
          </AppInputAdornment>
        }
        onClick={handleSearchDrawerOpen}
      />
      <AppDrawer
        open={searchDrawerOpen}
        keepMounted
        sx={{
          pointerEvents: searchDrawerOpen ? "auto" : "none",
        }}
        onClose={handleSearchDrawerClose}
      >
        <AppDrawerTitle className={classes.drawerTitle} stickyHeader>
          <AppIconButton
            color="text.primary"
            edge={"xy"}
            borderRadius="circular"
            onClick={handleSearchDrawerClose}
          >
            <AppSvgIcon component={ArrowLeftIcon} />
          </AppIconButton>
          <AppTextField
            fullWidth
            inputRef={searchInputRef}
            classes={{
              root: classes.searchTextField,
            }}
            inputProps={{
              inputMode: "search",
            }}
            FormControlProps={{
              component: "form",
              onSubmit: handleSearchSubmit,
            }}
            autoComplete="off"
            borderRadius="circular"
            value={search}
            endAdornment={
              <AppInputAdornment position="end">
                <AppIconButton
                  borderRadius="circular"
                  color="text.primary"
                  edge={"x"}
                  type="submit"
                  onClick={handleSearchSubmit}
                >
                  <AppSvgIcon component={SearchIcon} />
                </AppIconButton>
              </AppInputAdornment>
            }
            onChange={onSearchChange}
          />
        </AppDrawerTitle>
        <AppDrawerBody disablePadding>
          <AppList disablePadding>
            <AppListItemButton onClick={handleProductCategoryListDrawerOpen}>
              <AppListItemText
                primary={
                  selectedProductCategory
                    ? selectedProductCategory.title
                    : t("allCategories")
                }
              />
              <AppSvgIcon component={ArrowRightIcon} />
            </AppListItemButton>
          </AppList>
          <Divider />
          <AppList disablePadding>
            {!searchInput && histories.length > 0 && (
              <AppListItem>
                <AppListItemText
                  primary={t("recent")}
                  primaryTypographyProps={{
                    variant: "bodyMed14",
                  }}
                />
                <Typography
                  color="primary.main"
                  variant="bodyMed14"
                  sx={{ cursor: "pointer" }}
                  onClick={handleHistoryClear}
                >
                  {t("clear")}
                </Typography>
              </AppListItem>
            )}
            {optionMenus.map((optionMenu, optionMenuIndex) => {
              return (
                <AppListItem
                  key={optionMenuIndex}
                  sx={{ cursor: "pointer" }}
                  onClick={handleOptionMenuClick(optionMenu)}
                >
                  {optionMenu.isHistory ? (
                    <AppListItemIcon>
                      <AppSvgIcon
                        className={classes.optionMenuIcon}
                        component={HistoryIcon}
                      />
                    </AppListItemIcon>
                  ) : optionMenu.variant === "userSearch" ? (
                    <AppListItemIcon>
                      <AppSvgIcon
                        className={classes.optionMenuIcon}
                        component={UserCircleIcon}
                      />
                    </AppListItemIcon>
                  ) : (
                    <AppListItemIcon>
                      <AppSvgIcon
                        className={classes.optionMenuIcon}
                        component={SearchIcon}
                      />
                    </AppListItemIcon>
                  )}
                  <AppListItemText primary={optionMenu.label} />
                  {optionMenu.isHistory && (
                    <div
                      className={classes.optionMenuClear}
                      onClick={handleHistoryRemove(optionMenu.key)}
                    >
                      <AppSvgIcon
                        className={classes.optionMenuClearIcon}
                        component={CloseIcon}
                      />
                    </div>
                  )}
                </AppListItem>
              );
            })}
          </AppList>
        </AppDrawerBody>
      </AppDrawer>
      <ProductCategoryListDrawer
        open={productCategoryListDrawerOpen}
        productCategory={selectedProductCategory}
        onChange={(_, productCategory) =>
          handleProductCategoryChange(productCategory)
        }
        onClose={handleProductCategoryListDrawerClose}
      />
    </>
  );
};

export default MobileSearch;
