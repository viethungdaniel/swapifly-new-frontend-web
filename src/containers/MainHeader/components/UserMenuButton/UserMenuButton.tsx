import { bindActionCreators } from "@reduxjs/toolkit";

import { storeAuthAction } from "@/store";
import {
  commonHelpers,
  imageHelpers,
  reduxHelpers,
  userHelpers,
} from "@/utils/helpers";
import { alertDialogService, loadingScreenOverlayService } from "@/services";

import AppAvatar from "@/components/AppAvatar";
import AppButton from "@/components/AppButton";
import AppListItemIcon from "@/components/AppListItemIcon";
import AppMenuItem from "@/components/AppMenuItem";
import AppMenuList from "@/components/AppMenuList";
import AppSvgIcon from "@/components/AppSvgIcon";
import PopperScrollingPaper from "@/components/PopperScrollingPaper";
import { ClickAwayListener, Grow, Popper } from "@mui/material";
import AppListItemText from "@/components/AppListItemText";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";

import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";

import LogoutIcon from "@@/public/images/icons/logout.svg";
import SettingIcon from "@@/public/images/icons/setting.svg";
import ProfileIcon from "@@/public/images/icons/profile.svg";
import MerchantCircularTagSvg from "@@/public/images/svgs/merchant-circular-tag.svg";

import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector, useIsMounted } from "@/hooks";

import useStyles from "./UserMenuButton.styles";

const UserMenuButton = () => {
  const [popperAnchorEl, setPopperAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const popperAnchorOpen = !!popperAnchorEl;

  const router = useRouter();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUser = useAppSelector((state) => state.auth.user);

  const { classes, theme } = useStyles();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setPopperAnchorEl(popperAnchorEl ? null : event.currentTarget);
  };

  const handleClose = (event: React.SyntheticEvent) => {
    if (popperAnchorEl && popperAnchorEl.contains(event.target as any)) return;
    setPopperAnchorEl(null);
  };

  const handleSignOut = async (event: React.MouseEvent) => {
    handleClose(event);
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
    router.push(router, undefined, { scroll: false });
  };

  const isMounted = useIsMounted();

  return (
    <>
      <AppButton
        fullMaxHeight
        color="text.primary"
        edge="xy"
        borderRadius="circular"
        startIcon={
          <div className={classes.userAvatar}>
            <AppAvatar
              src={imageHelpers.appImageLoader({
                src: $s_authUser?.avatar,
              })}
              sx={{ width: "100%", height: "100%" }}
            />
            {userHelpers.isMerchant($s_authUser?.shop) && (
              <MerchantCircularTagSvg
                className={classes.merchantCircularTagSvg}
              />
            )}
          </div>
        }
        onClick={handleToggle}
      >
        <AppTypography variant="inherit" component="span" maxWidth={60} noWrap>
          {$s_authUser?.nickname}
        </AppTypography>
      </AppButton>
      <Popper
        anchorEl={popperAnchorEl}
        open={popperAnchorOpen}
        placement="bottom-end"
        disablePortal
        transition
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
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
                <AppMenuList className={classes.menuList} autoFocus>
                  <AppMenuItem
                    component={AppLink}
                    hoverColor="initial"
                    href={`/${commonHelpers.generateUserSlug(
                      $s_authUser as any
                    )}`}
                    selected={
                      router.asPath ===
                      `/${commonHelpers.generateUserSlug($s_authUser as any)}`
                    }
                    onClick={handleClose}
                  >
                    <AppListItemIcon>
                      <AppSvgIcon component={ProfileIcon} />
                    </AppListItemIcon>
                    <AppListItemText
                      primary={t("myProfile")}
                      primaryTypographyProps={{
                        variant:
                          router.asPath ===
                          `/${commonHelpers.generateUserSlug(
                            $s_authUser as any
                          )}`
                            ? "bodyMed14"
                            : "bodyReg14",
                      }}
                    />
                  </AppMenuItem>
                  <AppMenuItem
                    component={AppLink}
                    hoverColor="initial"
                    href="/user/account/profile"
                    selected={/^\/user\/account/.test(router.asPath)}
                    onClick={handleClose}
                  >
                    <AppListItemIcon>
                      <AppSvgIcon component={SettingIcon} />
                    </AppListItemIcon>
                    <AppListItemText
                      primary={t("setting")}
                      primaryTypographyProps={{
                        variant: /^\/user\/account/.test(router.asPath)
                          ? "bodyMed14"
                          : "bodyReg14",
                      }}
                    />
                  </AppMenuItem>
                  <AppMenuItem onClick={handleSignOut}>
                    <AppListItemIcon>
                      <AppSvgIcon component={LogoutIcon} />
                    </AppListItemIcon>
                    <AppListItemText primary={t("logout")} />
                  </AppMenuItem>
                </AppMenuList>
              </PopperScrollingPaper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default UserMenuButton;
