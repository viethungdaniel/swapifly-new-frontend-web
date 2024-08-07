import _kebabCase from "lodash/kebabCase";
import { useEffect, useMemo, useState } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";

import { storeAuthAction } from "@/store";
import {
  commonHelpers,
  imageHelpers,
  reduxHelpers,
  userHelpers,
} from "@/utils/helpers";
import { commonConfig } from "@/utils/config";
import { alertDialogService, loadingScreenOverlayService } from "@/services";

import { ButtonBase, Typography } from "@mui/material";
import MenuIcon from "@@/public/images/icons/menu.svg";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppDrawer from "@/components/AppDrawer";
import AppDrawerTitle from "@/components/AppDrawerTitle";
import AppAvatar from "@/components/AppAvatar";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemButton from "@/components/AppListItemButton";
import AppListItemText from "@/components/AppListItemText";
import AppLink from "@/components/AppLink";
import ProductCategoryListDrawer from "@/containers/ProductCategoryListDrawer";
import AppListItemIcon from "@/components/AppListItemIcon";
import SettingMenuDrawer from "@/components/SettingMenuDrawer";
import AppTypography from "@/components/AppTypography";

import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";
import LogoutIcon from "@@/public/images/icons/logout.svg";
import MerchantCircularTagSvg from "@@/public/images/svgs/merchant-circular-tag.svg";

import { useRouter } from "next/router";
import {
  useAppDispatch,
  useAppSelector,
  useAuthUser,
  useIsMounted,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./DrawerMenu.styles";

type ProductCategoryListDrawerProps = React.ComponentProps<
  typeof ProductCategoryListDrawer
>;

const DrawerMenu = () => {
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [productCategoryListDrawerOpen, setProductCategoryListDrawerOpen] =
    useState(false);
  const [settingMenuDrawerOpen, setSettingMenuDrawerOpen] = useState(false);

  const { hasAuth, handleAuthNavigationPush, openSignInAndSignUpDialog } =
    useAuthUser();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUser = useAppSelector((state) => state.auth.user);
  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const { classes } = useStyles();

  const router = useRouter();

  const handleMenuDrawerOpen = () => {
    setMenuDrawerOpen(true);
  };
  const handleMenuDrawerClose = () => {
    setMenuDrawerOpen(false);
    setSettingMenuDrawerOpen(false);
  };

  const handleSettingMenuDrawerOpen = () => {
    setSettingMenuDrawerOpen(true);
  };
  const handleSettingMenuDrawerClose = () => {
    setSettingMenuDrawerOpen(false);
  };

  const handleProductCategoryListDrawerOpen = () => {
    setProductCategoryListDrawerOpen(true);
  };

  const handleProductCategoryListDrawerClose = () => {
    setProductCategoryListDrawerOpen(false);
  };

  const handleProductCategoryNavigate: ProductCategoryListDrawerProps["onChange"] =
    (_, productCategory) => {
      setMenuDrawerOpen(false);
      router.push({
        pathname: !!productCategory?.id
          ? `/${commonHelpers.generateProductCategorySlug(
              productCategory?.title,
              productCategory?.id
            )}`
          : "/search",
      });
    };

  const handleSignOut = async () => {
    if (!$s_hasAuth) return;
    const { isConfirmed } = await alertDialogService.fire({
      title: t("logout"),
      content: t("logoutConfirmationTitle"),
      actions: [
        {
          children: t("cancel"),
          buttonProps: {
            variant: "outlined",
            color: "text.primary",
          },
        },
        {
          children: t("logout"),
          buttonProps: {
            variant: "contained",
            color: "text.primary",
          },
          isConfirmAction: true,
        },
      ],
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    await reduxHelpers.callActionWithPromise($s_authAction.signOutSaga);
    loadingScreenOverlayService.close();
    if (!isMounted()) return;
    handleMenuDrawerClose();
    router.push(router, undefined, { scroll: false });
  };

  useEffect(() => {
    if (!!$s_hasAuth) {
      setMenuDrawerOpen(false);
      setSettingMenuDrawerOpen(false);
    }
  }, [$s_hasAuth]);

  const isMounted = useIsMounted();

  return (
    <>
      <AppIconButton
        color="text.primary"
        borderRadius="circular"
        edge={"xy"}
        onClick={handleMenuDrawerOpen}
      >
        <AppSvgIcon component={MenuIcon} fontSize="inherit" />
      </AppIconButton>
      <AppDrawer
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        open={menuDrawerOpen}
        onClose={handleMenuDrawerClose}
      >
        <AppDrawerTitle
          className={classes.user}
          stickyHeader
          {...(!!$s_authUser?.id
            ? {
                component: AppLink,
                href: `/${commonHelpers.generateUserSlug($s_authUser)}`,
                underline: "none",
                hoverColor: "none",
                onClick: handleMenuDrawerClose,
              }
            : {
                component: ButtonBase,
                onClick: () => openSignInAndSignUpDialog(),
              })}
        >
          {$s_hasAuth ? (
            <>
              <div className={classes.userAvatarWrapper}>
                <AppAvatar
                  className={classes.userAvatar}
                  src={imageHelpers.appImageLoader({
                    src: $s_authUser?.avatar,
                  })}
                />
                {userHelpers.isMerchant($s_authUser?.shop) && (
                  <MerchantCircularTagSvg
                    className={classes.merchantCircularTagSvg}
                  />
                )}
              </div>
              <div className={classes.userContent}>
                <Typography variant="bodyMed16" noWrap>
                  {$s_authUser?.nickname}
                </Typography>
                <Typography noWrap>{t("myProfile")}</Typography>
              </div>
              <AppSvgIcon component={ArrowRightIcon} />
            </>
          ) : (
            <>
              <AppAvatar
                className={classes.userAvatar}
                src={imageHelpers.appImageLoader({
                  src: $s_authUser?.avatar,
                })}
              />
              <div className={classes.userContent}>
                <Typography variant="bodyMed14">
                  {t("loginOrRegister")}
                </Typography>
                <Typography>{t("secondTradeWithZeroCommission")}</Typography>
              </div>
              <AppSvgIcon component={ArrowRightIcon} />
            </>
          )}
        </AppDrawerTitle>
        <AppList className={classes.menuList} disablePadding>
          <AppListItem
            disablePadding
            divider
            component={AppLink}
            href="/bookmarks"
            underline="none"
            hoverColor="none"
            onClick={(event) => {
              if (!hasAuth) {
                handleAuthNavigationPush("/bookmarks")(event);
              } else {
                handleMenuDrawerClose();
              }
            }}
          >
            <AppListItemButton classes={{ gutters: classes.menuItemGutters }}>
              <AppListItemText primary={t("bookmark")} />
              <AppSvgIcon component={ArrowRightIcon} />
            </AppListItemButton>
          </AppListItem>
          <AppListItem
            disablePadding
            divider
            component={AppLink}
            href="/inbox"
            underline="none"
            hoverColor="none"
            onClick={(event) => {
              if (!hasAuth) {
                handleAuthNavigationPush("/inbox")(event);
              } else {
                handleMenuDrawerClose();
              }
            }}
          >
            <AppListItemButton classes={{ gutters: classes.menuItemGutters }}>
              <AppListItemText primary={t("inbox")} />
              <AppSvgIcon component={ArrowRightIcon} />
            </AppListItemButton>
          </AppListItem>
          <AppListItem
            disablePadding
            divider
            onClick={handleProductCategoryListDrawerOpen}
          >
            <AppListItemButton classes={{ gutters: classes.menuItemGutters }}>
              <AppListItemText primary={t("category")} />
              <AppSvgIcon component={ArrowRightIcon} />
            </AppListItemButton>
          </AppListItem>
          <AppListItem
            disablePadding
            divider
            component={AppLink}
            href="/news"
            underline="none"
            hoverColor="none"
            onClick={handleMenuDrawerClose}
          >
            <AppListItemButton classes={{ gutters: classes.menuItemGutters }}>
              <AppListItemText primary={t("news")} />
              <AppSvgIcon component={ArrowRightIcon} />
            </AppListItemButton>
          </AppListItem>
          <AppListItem disablePadding>
            <AppListItemButton
              classes={{ gutters: classes.menuItemGutters }}
              onClick={handleSettingMenuDrawerOpen}
            >
              <AppListItemText primary={t("setting")} />
              <AppSvgIcon component={ArrowRightIcon} />
            </AppListItemButton>
          </AppListItem>
        </AppList>
        <AppList disablePadding>
          <AppListItem disablePadding onClick={handleSignOut}>
            {$s_hasAuth && (
              <AppListItemButton
                sx={(theme) => ({ color: theme.palette.primary.main })}
              >
                <AppListItemIcon sx={{ color: "inherit" }}>
                  <AppSvgIcon component={LogoutIcon} color="inherit" />
                </AppListItemIcon>
                <AppListItemText primary={t("logout")} />
                <AppTypography
                  variant="captionReg12"
                  color="text.secondary"
                  whiteSpace="nowrap"
                >
                  v.{commonConfig.APP_VERSION}
                </AppTypography>
              </AppListItemButton>
            )}
            {!$s_authUser && (
              <AppListItem component="div">
                <AppListItemText primary={""} />
                <AppTypography variant="captionReg12" color="text.secondary">
                  v.{commonConfig.APP_VERSION}
                </AppTypography>
              </AppListItem>
            )}
          </AppListItem>
        </AppList>
      </AppDrawer>
      <ProductCategoryListDrawer
        open={productCategoryListDrawerOpen}
        onClose={handleProductCategoryListDrawerClose}
        onChange={handleProductCategoryNavigate}
      />
      <SettingMenuDrawer
        open={settingMenuDrawerOpen}
        onClose={handleSettingMenuDrawerClose}
        onMenuClick={handleMenuDrawerClose}
      />
    </>
  );
};

export default DrawerMenu;
