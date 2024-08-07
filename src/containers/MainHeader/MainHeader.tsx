import { commonHelpers } from "@/utils/helpers";
import { commonConstants } from "@/utils/constants";

import { AppBar, NoSsr, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import LogoImage from "@/components/LogoImage";
import AppButton from "@/components/AppButton";
import MainHeaderAppBarMenuToolbar from "@/components/MainHeaderAppBarMenuToolbar";
import ProductCategoryMenuList from "./components/ProductCategoryMenuList";
import RegionAndLanguage from "./components/RegionAndLanguage";
import DrawerMenu from "./components/DrawerMenu";
import MainSearch from "./components/MainSearch";
import NotificationsButton from "./components/NotificationsButton";
import InboxIconButton from "./components/InboxIconButton";
import BookmarkIconButton from "./components/BookmarkIconButton";
import UserMenuButton from "./components/UserMenuButton";
import SmartAppBanner from "@/components/SmartAppBanner";
import SmartAppBannerToolbar from "@/components/SmartAppBannerToolbar";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import HomeIcon from "@@/public/images/icons/home.svg";

import MainHeaderContext from "./MainHeader.context";

import MainHeaderAppBarToolbar from "@/components/MainHeaderAppBarToolbar";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppSelector, useAuthUser, useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./MainHeader.styles";

import type { MainHeaderContextValue } from "./MainHeader.context";

type RouterQuery = {
  keyword?: string;
  product_category?: string;
};

type MainHeaderProps = {
  disabledMobileHomeIconButton?: boolean;
};

const LoginButton = () => {
  const { openSignInAndSignUpDialog } = useAuthUser();

  const { t } = useTranslation();

  return (
    <AppButton
      color="text.primary"
      variant="outlined"
      onClick={() => openSignInAndSignUpDialog()}
    >
      {t("login")}
    </AppButton>
  );
};

const MainHeader = (props: MainHeaderProps) => {
  const { disabledMobileHomeIconButton } = props;

  const { classes, theme } = useStyles();

  const [showSmartAppBanner, setShowSmartAppBanner] = useState(
    commonHelpers.isMobile()
  );

  const router = useRouter();
  const query = router.query as RouterQuery;

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));
  const isLgDown = useMediaQuery(theme.breakpoints.down("lg"));

  const [search, setSearch] = useState(() => {
    return typeof window === "undefined" ? "" : query.keyword ?? "";
  });
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState<
    MainHeaderContextValue["selectedProductCategoryId"]
  >(() => {
    const queryProductCategory = commonHelpers.getOneRouterQueryValue(
      query.product_category
    );
    if (!commonHelpers.isNumber(queryProductCategory)) return null;
    return Number(queryProductCategory);
  });

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const handleSmartAppBannerClose = () => {
    setShowSmartAppBanner(false);
  };

  useEffect(() => {
    if (router.isReady && !!query.keyword) {
      setSearch(query?.keyword ?? "");
    }
  }, [router.isReady, query.keyword]);

  useEffect(() => {
    if (!isMounted()) return;
    if (router.isReady) {
      const queryProductCategory = commonHelpers.getOneRouterQueryValue(
        query.product_category
      );
      setSelectedProductCategoryId(
        commonHelpers.isNumber(queryProductCategory)
          ? Number(queryProductCategory)
          : null
      );
    }
  }, [router.isReady, query.product_category]);

  useEffect(() => {
    if (!isMounted()) return;
    if (router.isReady) {
      const queryKeyword = commonHelpers.getOneRouterQueryValue(query.keyword);
      setSearch(queryKeyword ?? "");
    }
  }, [router.isReady, query.keyword]);

  const isMounted = useIsMounted();

  return (
    <MainHeaderContext.Provider
      value={{
        search,
        setSearch,
        selectedProductCategoryId,
        setSelectedProductCategoryId,
      }}
    >
      <AppBar
        id={commonConstants.MAIN_HEADER_ELE_ID}
        elevation={0}
        color="default"
      >
        {showSmartAppBanner && (
          <SmartAppBanner onClose={handleSmartAppBannerClose} />
        )}
        <div className={classes.mainAppBar}>
          <AppContainer>
            <MainHeaderAppBarToolbar
              className={classes.mainHeaderAppToolbar}
              disableGutters
            >
              <NoSsr>
                {!isTabletDown ? (
                  <>
                    <AppLink
                      href={{
                        pathname: "/",
                      }}
                      display="flex"
                    >
                      <LogoImage className={classes.logo} />
                    </AppLink>
                    <div className={classes.mainHeaderAppToolbarFullWidth}>
                      <div className={classes.mainSearch}>
                        <MainSearch variant={isLgDown ? "mobile" : "desktop"} />
                      </div>
                    </div>
                    <div className={classes.mainHeaderAppToolbarActions}>
                      {$s_hasAuth ? (
                        <>
                          <RegionAndLanguage variant="desktop" />
                          <UserMenuButton />
                          <BookmarkIconButton />
                          <NotificationsButton variant="desktop" />
                          <InboxIconButton />
                        </>
                      ) : (
                        <>
                          <RegionAndLanguage variant="desktop" />
                          <LoginButton />
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <DrawerMenu />
                    {!disabledMobileHomeIconButton && (
                      <AppIconButton
                        edge="xy"
                        borderRadius="circular"
                        color="text.primary"
                        component={AppLink}
                        href="/"
                      >
                        <AppSvgIcon
                          component={HomeIcon}
                          fontSize="inherit"
                          color="inherit"
                        />
                      </AppIconButton>
                    )}
                    <div className={classes.mainHeaderAppToolbarFullWidth}>
                      <MainSearch variant="mobile" />
                    </div>
                    <RegionAndLanguage variant="mobile" />
                    {$s_hasAuth && <NotificationsButton variant="mobile" />}
                  </>
                )}
              </NoSsr>
            </MainHeaderAppBarToolbar>
          </AppContainer>
        </div>
        {!isTabletDown && (
          <NoSsr>
            <div className={classes.menuAppBar}>
              <AppContainer>
                <MainHeaderAppBarMenuToolbar>
                  <ProductCategoryMenuList />
                </MainHeaderAppBarMenuToolbar>
              </AppContainer>
            </div>
          </NoSsr>
        )}
      </AppBar>
      {showSmartAppBanner && <SmartAppBannerToolbar />}
      {!isTabletDown && <MainHeaderAppBarMenuToolbar />}
      <MainHeaderAppBarToolbar />
    </MainHeaderContext.Provider>
  );
};

export default MainHeader;
