import { commonHelpers, imageHelpers } from "@/utils/helpers";

import { Grid, Typography, useMediaQuery } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppAvatar from "@/components/AppAvatar";
import MainBottomAppBarToolbar from "@/components/MainBottomAppBarToolbar";
import AppBadge from "@/components/AppBadge";
import AppLink from "@/components/AppLink";
import AppBottomAppBar from "@/components/AppBottomAppBar";

import HomeIcon from "@@/public/images/icons/home.svg";
import BookmarkIcon from "@@/public/images/icons/bookmark.svg";
import InboxIcon from "@@/public/images/icons/inbox.svg";

import { useRouter } from "next/router";
import {
  useAppSelector,
  useAuthUser,
  useEventCallback,
  useIsomorphicLayoutEffect,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./MainBottomAppBar.styles";
import { useState } from "react";
import { commonConstants } from "@/utils/constants";

type MainBottomAppBarProps = {
  disabledAppBar?: boolean;
  disabledAppBarToolbar?: boolean;
};

const MenuItemUser = () => {
  const { classes, cx } = useStyles();

  const router = useRouter();

  const $s_authUser = useAppSelector((state) => state.auth.user);

  const { handleAuthNavigationPush } = useAuthUser();

  const { t } = useTranslation();

  return (
    <AppLink
      href={`/${commonHelpers.generateUserSlug($s_authUser)}`}
      underline="none"
      hoverColor="none"
      className={cx(
        classes.menuItem,
        !!$s_authUser?.id &&
          router.asPath === `/${commonHelpers.generateUserSlug($s_authUser)}` &&
          classes.selected
      )}
      onClick={handleAuthNavigationPush("/profile")}
    >
      <AppAvatar
        className={classes.menuItemAvatar}
        src={imageHelpers.appImageLoader({
          src: $s_authUser?.avatar,
        })}
      />
      <Typography
        variant={
          router.asPath === `/${commonHelpers.generateUserSlug($s_authUser)}`
            ? "captionMed12"
            : "captionReg12"
        }
        color="inherit"
        noWrap
        component="span"
      >
        {t("account")}
      </Typography>
    </AppLink>
  );
};

const MenuItemInbox = () => {
  const { handleAuthNavigationPush } = useAuthUser();

  const { classes, cx } = useStyles();

  const { t } = useTranslation();

  const router = useRouter();

  const $s_unreadInboxThreadMessageCount = useAppSelector(
    (state) => state.inbox.unreadInboxThreadMessageCount
  );

  return (
    <AppLink
      href="/inbox"
      underline="none"
      hoverColor="none"
      className={cx(
        classes.menuItem,
        !!router.asPath.match(/^\/inbox/) && classes.selected
      )}
      onClick={handleAuthNavigationPush("/inbox")}
    >
      <AppBadge
        color="common.dotRed"
        badgeContent={$s_unreadInboxThreadMessageCount}
        max={99}
        sx={{ whiteSpace: "nowrap" }}
      >
        <AppSvgIcon
          component={InboxIcon}
          color="inherit"
          className={classes.menuItemIcon}
        />
      </AppBadge>
      <Typography
        variant={
          !!router.asPath.match(/^\/inbox/) ? "captionMed12" : "captionReg12"
        }
        color="inherit"
        noWrap
        component="span"
      >
        {t("inbox")}
      </Typography>
    </AppLink>
  );
};

const MenuItemBookmark = () => {
  const { classes, cx } = useStyles();

  const { t } = useTranslation();

  const router = useRouter();

  const { handleAuthNavigationPush } = useAuthUser();

  return (
    <AppLink
      href="/bookmarks"
      className={cx(
        classes.menuItem,
        !!router.asPath.match(/^\/bookmarks/) && classes.selected
      )}
      underline="none"
      hoverColor="none"
      onClick={handleAuthNavigationPush("/bookmarks")}
    >
      <AppSvgIcon
        component={BookmarkIcon}
        color="inherit"
        className={classes.menuItemIcon}
      />
      <Typography
        variant={
          !!router.asPath.match(/^\/bookmarks/)
            ? "captionMed12"
            : "captionReg12"
        }
        color="inherit"
        noWrap
        component="span"
      >
        {t("bookmark")}
      </Typography>
    </AppLink>
  );
};

const AutoSizerMainBottomAppBarToolbar = () => {
  const [size, setSize] = useState(0);

  const updateMainBottomAppBarToolbarSize = useEventCallback(() => {
    const mainBottomAppBarToolbarAnchors = document.querySelectorAll(
      `.${commonConstants.MAIN_BOTTOM_APP_BAR_TOOLBAR_ELE_CLASS}`
    );
    if (mainBottomAppBarToolbarAnchors.length > 0) {
      let newSize = 0;
      mainBottomAppBarToolbarAnchors.forEach((toolbarEl) => {
        newSize =
          toolbarEl.clientHeight > newSize ? toolbarEl.clientHeight : newSize;
      });
      setSize(newSize);
    } else setSize(0);
  });

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      updateMainBottomAppBarToolbarSize();
    });

    observer.observe(document, {
      subtree: true,
      attributes: true,
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <MainBottomAppBarToolbar
      sx={{
        minHeight: size ?? undefined,
      }}
    />
  );
};

const MainBottomAppBar = (props: MainBottomAppBarProps) => {
  const { disabledAppBar, disabledAppBarToolbar } = props;

  const { t } = useTranslation();

  const { classes, theme, cx } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const router = useRouter();

  return isTabletDown ? (
    <>
      {!disabledAppBar && (
        <AppBottomAppBar>
          <MainBottomAppBarToolbar className={classes.menuList} disableGutters>
            <Grid
              container
              alignItems="center"
              sx={{ height: "100%" }}
              wrap="nowrap"
            >
              <Grid item xs sx={{ height: "100%" }}>
                <AppLink
                  href="/"
                  underline="none"
                  hoverColor="none"
                  className={cx(
                    classes.menuItem,
                    router.asPath === "/" && classes.selected
                  )}
                >
                  <AppSvgIcon
                    component={HomeIcon}
                    color="inherit"
                    className={classes.menuItemIcon}
                  />
                  <Typography
                    variant={
                      router.asPath === "/" ? "captionMed12" : "captionReg12"
                    }
                    color="inherit"
                    noWrap
                    component="span"
                  >
                    {t("home")}
                  </Typography>
                </AppLink>
              </Grid>
              <Grid item xs sx={{ height: "100%" }}>
                <MenuItemBookmark />
              </Grid>
              <Grid item xs sx={{ height: "100%" }}>
                <MenuItemInbox />
              </Grid>
              <Grid item xs sx={{ height: "100%" }}>
                <MenuItemUser />
              </Grid>
            </Grid>
          </MainBottomAppBarToolbar>
        </AppBottomAppBar>
      )}
      {!disabledAppBarToolbar && <AutoSizerMainBottomAppBarToolbar />}
    </>
  ) : null;
};

export default MainBottomAppBar;
