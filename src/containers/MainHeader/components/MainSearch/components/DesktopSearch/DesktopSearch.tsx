import { storeProductCategorySelectors } from "@/store";

import { ClickAwayListener, Divider, Popper, Typography } from "@mui/material";
import AppIconButton from "@/components/AppIconButton";
import AppPaper from "@/components/AppPaper";
import AppMenuList from "@/components/AppMenuList";
import AppListItemIcon from "@/components/AppListItemIcon";
import AppListItemText from "@/components/AppListItemText";
import AppListItem from "@/components/AppListItem";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import ProductCategoryListDrawer from "@/containers/ProductCategoryListDrawer";
import AppButton from "@/components/AppButton";

import SearchIcon from "@@/public/images/icons/search.svg";
import CloseIcon from "@@/public/images/icons/close.svg";
import HistoryIcon from "@@/public/images/icons/history.svg";
import UserCircleIcon from "@@/public/images/icons/user-circle.svg";
import ArrowDownIcon from "@@/public/images/icons/arrow-down.svg";

import MainSearchContext from "../../MainSearch.context";

import { useAppSelector, useIsomorphicLayoutEffect } from "@/hooks";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "next-i18next";

import MainHeaderContext from "@/containers/MainHeader/MainHeader.context";

import useStyles from "./DesktopSearch.styles";

const ScrollingAppMenuList = forwardRef(
  (
    props: React.ComponentProps<typeof AppMenuList>,
    ref: React.ForwardedRef<any>
  ) => {
    const rootElRef = useRef<HTMLUListElement>(null!);

    useIsomorphicLayoutEffect(() => {
      const rootEl = rootElRef.current;
      if (!rootEl) return;
      const updateRootElTimeout = setTimeout(() => {
        const rootElRect = rootEl.getBoundingClientRect();
        rootEl.style.maxHeight = `calc(100vh - ${rootElRect.y}px - 50px)`;
        rootEl.style.overflow = "auto";
      });
      return () => {
        clearTimeout(updateRootElTimeout);
      };
    });

    useImperativeHandle(ref, () => rootElRef.current);

    return <AppMenuList ref={rootElRef} {...props} />;
  }
);

const DesktopSearch = () => {
  const {
    search,
    searchInput,
    submittedSearch,
    optionMenus,
    histories,
    setSearch,
    submitSearch,
    handleSearchChange: onSearchChange,
    handleProductCategoryChange,
    handleHistoryRemove,
    handleHistoryClear,
  } = useContext(MainSearchContext);

  const { selectedProductCategoryId } = useContext(MainHeaderContext);

  const [focusedOptionMenuKey, setFocusedOptionMenuKey] = useState<
    string | null
  >(null);
  const [popperAnchorEl, setPopperAnchorEl] = useState<HTMLDivElement>();
  const [popperOpen, setPopperOpen] = useState(false);
  const [productCategoryListDrawerOpen, setProductCategoryListDrawerOpen] =
    useState(false);

  const searchTextFieldRef = useRef<HTMLDivElement>(undefined!);
  const searchTextFieldInputRef = useRef<HTMLInputElement>(undefined!);

  const { t } = useTranslation();

  const $s_idToProductCategoriesTreesMap = useAppSelector(
    storeProductCategorySelectors.selectIdToProductCategoriesTreesMap
  );

  const focusedOptionMenuIndex = useMemo(() => {
    return optionMenus.findIndex(
      (optionMenu) => optionMenu.key === focusedOptionMenuKey
    );
  }, [optionMenus, focusedOptionMenuKey]);

  const categoryButtonText = useMemo(() => {
    if (!selectedProductCategoryId) return t("allCategories");
    return (
      $s_idToProductCategoriesTreesMap[selectedProductCategoryId as any]
        ?.title || t("allCategories")
    );
  }, [selectedProductCategoryId, $s_idToProductCategoriesTreesMap, t]);

  const { classes, cx, theme } = useStyles();

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFocusedOptionMenuKey(null);
    setPopperOpen(true);
    onSearchChange(event);
  };

  const handleFocusedOptionMenuIndexSubmit = () => {
    submitSearch(optionMenus[focusedOptionMenuIndex]);
    handlePopperClose();
  };

  const handleOptionMenuClick =
    (optionMenu: (typeof optionMenus)[number]) => () => {
      submitSearch(optionMenu);
      handlePopperClose();
    };

  const handlePopperToggle: React.MouseEventHandler = (event) => {
    event.preventDefault();
    setPopperAnchorEl(searchTextFieldRef.current);
    setPopperOpen((prevOpen) => !prevOpen);
  };

  const handlePopperOpen = (_?: React.SyntheticEvent) => {
    setPopperOpen(true);
  };

  const handlePopperClose = (event?: React.SyntheticEvent) => {
    if ([searchTextFieldInputRef.current].includes(event?.target as any))
      return;
    setPopperOpen(false);
  };

  const changeFocusedOptionIndexByKeyDown = (diff: number) => {
    let nextFocusedOptionMenuIndex = 0;
    switch (diff) {
      case 1: {
        nextFocusedOptionMenuIndex =
          focusedOptionMenuIndex + 1 > optionMenus.length - 1
            ? -1
            : (focusedOptionMenuIndex + 1) % optionMenus.length;
        break;
      }

      case -1: {
        nextFocusedOptionMenuIndex =
          focusedOptionMenuIndex - 1 === -1
            ? -1
            : ((focusedOptionMenuIndex === -1 ? 0 : focusedOptionMenuIndex) +
                optionMenus.length -
                1) %
              optionMenus.length;
        break;
      }
    }
    const focusedOptionMenu = optionMenus[nextFocusedOptionMenuIndex];

    setSearch(
      focusedOptionMenu?.search || searchInput || submittedSearch || ""
    );
    setFocusedOptionMenuKey(!!focusedOptionMenu ? focusedOptionMenu.key : null);
  };

  const handleTextFieldClick: React.MouseEventHandler = (event) => {
    if (event.target === event.currentTarget) {
      handlePopperToggle(event);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    const { key } = event;

    switch (key) {
      case "ArrowUp": {
        event.preventDefault();
        if (!popperOpen) {
          handlePopperOpen(event);
          break;
        }
        changeFocusedOptionIndexByKeyDown(-1);
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        if (!popperOpen) {
          handlePopperOpen(event);
          break;
        }
        changeFocusedOptionIndexByKeyDown(1);
        break;
      }
      case "Escape": {
        event.preventDefault();
        if (popperOpen) {
          setPopperOpen(false);
          break;
        }
        break;
      }

      case "Enter": {
        event.preventDefault();
        handleFocusedOptionMenuIndexSubmit();
        break;
      }
    }
  };

  useEffect(() => {
    setPopperAnchorEl(searchTextFieldRef.current);
  }, []);

  return (
    <>
      <AppTextField
        fullWidth
        ref={searchTextFieldRef}
        inputRef={searchTextFieldInputRef}
        classes={{
          root: classes.searchTextField,
        }}
        inputProps={{
          onClick: handleTextFieldClick,
          onKeyDown: handleKeyDown,
        }}
        autoComplete="off"
        borderRadius="circular"
        placeholder={`${t("searchItems")}...`}
        startAdornment={
          <AppInputAdornment position="start">
            <AppButton
              borderRadius="circular"
              color="common.darkNeutral"
              edge={"start"}
              endIcon={
                <AppSvgIcon component={ArrowDownIcon} sx={{ fontSize: 12 }} />
              }
              onClick={() => setProductCategoryListDrawerOpen(true)}
            >
              <Typography
                variant="inherit"
                noWrap
                sx={{ maxWidth: 120 }}
                component="span"
              >
                {categoryButtonText}
              </Typography>
            </AppButton>
            <Divider
              orientation="vertical"
              sx={(theme) => ({
                height: 20,
                borderColor: theme.palette.common.neutral,
              })}
            />
          </AppInputAdornment>
        }
        endAdornment={
          <AppInputAdornment position="end">
            <AppIconButton
              borderRadius="circular"
              color="text.primary"
              edge={"x"}
              onClick={handleFocusedOptionMenuIndexSubmit}
            >
              <AppSvgIcon component={SearchIcon} />
            </AppIconButton>
          </AppInputAdornment>
        }
        value={search}
        onChange={handleSearchChange}
        onClick={handleTextFieldClick}
      />
      <Popper
        open={popperOpen}
        anchorEl={popperAnchorEl}
        placement="bottom-start"
        keepMounted
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
          {
            name: "sameWidth",
            enabled: true,
            phase: "beforeWrite",
            fn: ({ state }) => {
              state.styles.popper.width = `${state.rects.reference.width}px`;
            },
            effect: ({ state }) => {
              state.elements.popper.style.width = `${
                (state.elements.reference as HTMLDivElement).offsetWidth
              }px`;
            },
          },
        ]}
        style={{
          zIndex: theme.zIndex.tooltip,
        }}
      >
        <ClickAwayListener onClickAway={handlePopperClose as any}>
          <div>
            {optionMenus.length > 0 && (
              <AppPaper boxShadowVariant="menuPopper" onKeyDown={handleKeyDown}>
                <ScrollingAppMenuList
                  onMouseLeave={() => setFocusedOptionMenuKey(null)}
                >
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
                    const key = optionMenu.key;
                    return (
                      <AppListItem
                        key={key}
                        className={cx(
                          optionMenuIndex === focusedOptionMenuIndex &&
                            "Mui-focused"
                        )}
                        sx={{ cursor: "pointer" }}
                        onClick={handleOptionMenuClick(optionMenu)}
                        onMouseEnter={() => setFocusedOptionMenuKey(key)}
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
                </ScrollingAppMenuList>
              </AppPaper>
            )}
          </div>
        </ClickAwayListener>
      </Popper>
      <ProductCategoryListDrawer
        open={productCategoryListDrawerOpen}
        onChange={(_, productCategory) =>
          handleProductCategoryChange(productCategory)
        }
        onClose={() => setProductCategoryListDrawerOpen(false)}
      />
    </>
  );
};

export default DesktopSearch;
