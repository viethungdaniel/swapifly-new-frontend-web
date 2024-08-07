import axios from "axios";
import { bindActionCreators } from "redux";

import { commonConstants } from "@/utils/constants";
import {
  useAppDispatch,
  useAppSelector,
  useEventCallback,
  useIsMounted,
} from "@/hooks";
import { storeAdAction, storeAuthAction } from "@/store";
import { commonHelpers } from "@/utils/helpers";
import { alertDialogService } from "@/services";

import SwipeableViews from "react-swipeable-views";
import { Divider, Grid, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import UserProfileBanner from "@/views/SlugUser/components/UserProfileBanner";
import UserInfo from "@/views/SlugUser/components/UserInfo";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import AppTabs from "@/components/AppTabs";
import AppTab from "@/components/AppTab";
import LoadingOverlay from "@/components/LoadingOverlay";
import SlugUserContext from "@/views/SlugUser/SlugUser.context";
import TabPanelReviewList from "@/views/SlugUser/components/TabPanelReviewList";
import TabPanelSellerDetails from "@/views/SlugUser/components/TabPanelSellerDetails";
import AppButton from "@/components/AppButton";
import AppLink from "@/components/AppLink";
import AppSvgIcon from "@/components/AppSvgIcon";
import TabPanelBindSocialMedia from "@/views/SlugUser/components/TabPanelBindSocialMedia";
import FollowButton from "@/views/SlugUser/components/FollowButton";
import ReportButton from "@/views/SlugUser/components/ReportButton";
import ShareButton from "@/views/SlugUser/components/ShareButton";
import AppTabPanel from "@/components/AppTabPanel";
import TabPanelProductList from "@/views/SlugUser/components/TabPanelProductList";
import StickyAppBar from "@/components/StickyAppBar";
import TabPanelDescription from "@/views/SlugUser/components/TabPanelDescription";

import EditIcon from "@@/public/images/icons/edit.svg";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import useStyles from "./SlugUser.styles";

import type { CancelTokenSource } from "axios";

type RouterQuery = {
  slug: string;
  menu_tab?: string | string[];
};

const FetchData = () => {
  const router = useRouter();

  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_userLoading = useAppSelector((state) => state.user.userLoading);
  const $s_userError = useAppSelector((state) => state.user.userError);
  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_hasUser = !!$s_authUserId;

  const fetchedAuthUserShopSourceRef = useRef<CancelTokenSource | null>(null);
  const fetchedAuthUserLoginInfoSourceRef = useRef<CancelTokenSource | null>(
    null
  );
  const fetchedProductsAdsSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_adAction = useMemo(
    () => bindActionCreators(storeAdAction, dispatch),
    [dispatch]
  );

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const fetchProductsAds = () => {
    fetchedProductsAdsSourceRef.current &&
      fetchedProductsAdsSourceRef.current!.cancel();
    fetchedProductsAdsSourceRef.current = axios.CancelToken.source();
    $s_adAction.fetchAdsSaga(
      {
        params: {
          scopes: ["productsRectangleAds", "productsSquareAds"],
        },
        cancelToken: fetchedProductsAdsSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
  };

  useEffect(() => {
    fetchedAuthUserShopSourceRef.current = axios.CancelToken.source();
    fetchedAuthUserLoginInfoSourceRef.current = axios.CancelToken.source();

    if ($s_hasUser) {
      $s_authAction.fetchUserShopSaga({
        cancelToken: fetchedAuthUserShopSourceRef.current.token,
      });
      $s_authAction.fetchUserLoginInfoSaga({
        cancelToken: fetchedAuthUserLoginInfoSourceRef.current.token,
      });
    }

    return () => {
      fetchedAuthUserLoginInfoSourceRef.current!.cancel();

      fetchedAuthUserShopSourceRef.current = null;
      fetchedAuthUserLoginInfoSourceRef.current = null;
    };
  }, [$s_hasUser]);

  useEffect(() => {
    if (!$s_userLoading && !!$s_userError) router.push("/404");
  }, [$s_userLoading, $s_userError]);

  useEffect(() => {
    fetchProductsAds();
    return () => {
      fetchedProductsAdsSourceRef.current?.cancel &&
        fetchedProductsAdsSourceRef.current.cancel();
    };
  }, [$s_userId]);

  return null;
};

const MainContent = () => {
  const { userSlug } = useContext(SlugUserContext);

  const router = useRouter();

  const { t } = useTranslation();

  const query = router.query as RouterQuery;

  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);
  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);

  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const rootElRef = useRef<HTMLDivElement | null>(null);

  const menuTabs = useMemo(() => {
    let tabs = [
      {
        key: "listing",
        label: t("listing"),
        value: 0,
        TabPanelContent: TabPanelProductList,
      },
      {
        key: "description",
        label: t("description"),
        value: 1,
        TabPanelContent: TabPanelDescription,
      },
      {
        key: "reviews",
        label: t("reviews"),
        value: 2,
        TabPanelContent: TabPanelReviewList,
      },
    ];
    if ($s_userId === $s_authUserId) {
      tabs = tabs.concat([
        {
          key: "sellerDetails",
          label: t("sellerDetails"),
          value: 3,
          TabPanelContent: TabPanelSellerDetails,
        },
        {
          key: "bindSocialMedia",
          label: t("bindSocialMedia"),
          value: 4,
          TabPanelContent: TabPanelBindSocialMedia,
        },
      ]);
    }
    return tabs;
  }, [$s_userId, $s_authUserId, t]);

  const [selectedTabValue, setSelectedTabValue] = useState(() => {
    const menuTab = commonHelpers.getOneRouterQueryValue(query.menu_tab);
    if (
      commonHelpers.isNumber(menuTab) &&
      menuTabs.some((menuTabItem) => menuTabItem.value === Number(menuTab))
    )
      return Number(menuTab);
    return 0;
  });
  const curSelectedTabValueRef = useRef(selectedTabValue);

  const changeSelectedTabValue = (value: number) => {
    curSelectedTabValueRef.current = value;
    setSelectedTabValue(value);
    (router.query as any).menu_tab = value;
    router.push(router, undefined, {
      scroll: false,
      shallow: true,
    });
  };
  const handleSelectedTabIndexChange = (
    _: React.SyntheticEvent,
    value: number
  ) => {
    changeSelectedTabValue(value);
  };

  const handleSwipeableViewsIndexChange = (value: number) => {
    changeSelectedTabValue(value);
  };

  const handleTabClick = (_: React.SyntheticEvent) => {
    const headerEl = document.querySelector(
      `#${commonConstants.MAIN_HEADER_ELE_ID}`
    );
    let rootElTop = 0;
    const headerElHeight = headerEl?.clientHeight ?? 0;

    if (!!rootElRef.current) {
      const rootElClientRect = rootElRef.current.getBoundingClientRect();
      rootElTop = rootElClientRect.top - headerElHeight - 1;
      if (rootElTop > 0) return;
    }
    window.scrollTo({
      top: rootElTop + window.scrollY,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!isMounted()) return;
    changeSelectedTabValue(0);
  }, [userSlug, $s_authUserId]);

  useEffect(() => {
    if (!isMounted()) return;
    const menuTab = commonHelpers.getOneRouterQueryValue(query.menu_tab);
    if (
      commonHelpers.isNumber(menuTab) &&
      menuTabs.some((menuTabItem) => menuTabItem.value === Number(menuTab)) &&
      Number(menuTab) !== curSelectedTabValueRef.current
    ) {
      changeSelectedTabValue(Number(menuTab));
    }
  }, [query.menu_tab]);

  const isMounted = useIsMounted();

  return (
    <div className={classes.content} ref={rootElRef}>
      <StickyAppBar thresholdTopEle={`#${commonConstants.MAIN_HEADER_ELE_ID}`}>
        <div className={classes.menu}>
          <AppTabs
            selectionFollowsFocus
            classes={{
              root: classes.menuTabs,
            }}
            variant="scrollable"
            value={selectedTabValue}
          >
            {menuTabs.map((menuTab) => (
              <AppTab
                key={menuTab.key}
                className={classes.menuTab}
                label={menuTab.label}
                value={menuTab.value}
                onClick={(event) => {
                  handleTabClick(event);
                  handleSelectedTabIndexChange(event, menuTab.value);
                }}
              />
            ))}
          </AppTabs>
          {!isTabletDown && (
            <div className={classes.menuAction}>
              {$s_userId !== $s_authUserId ? (
                <>
                  <FollowButton viewMode="desktop" />
                  <ShareButton viewMode="desktop" />
                  <ReportButton viewMode="desktop" />
                </>
              ) : (
                <>
                  <AppButton
                    component={AppLink}
                    underline="none"
                    hoverColor="none"
                    href="/user/account/profile"
                    color="text.primary"
                    variant="outlined"
                    startIcon={
                      <AppSvgIcon component={EditIcon} fontSize="inherit" />
                    }
                  >
                    {t("editProfile")}
                  </AppButton>
                  <ShareButton viewMode="desktop" />
                </>
              )}
            </div>
          )}
        </div>
      </StickyAppBar>
      <SwipeableViews
        index={selectedTabValue}
        onChangeIndex={handleSwipeableViewsIndexChange}
      >
        {menuTabs.map(({ TabPanelContent, ...menuTab }) => (
          <AppTabPanel
            key={menuTab.key}
            keepMounted
            value={selectedTabValue}
            tabIndex={menuTab.value}
          >
            <TabPanelContent />
          </AppTabPanel>
        ))}
      </SwipeableViews>
    </div>
  );
};

const SlugUser = () => {
  const router = useRouter();

  const { theme } = useStyles();

  const query = router.query as RouterQuery;

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const $s_userLoading = useAppSelector((state) => state.user.userLoading);
  const $s_userError = useAppSelector((state) => state.user.userError);
  const $s_userId = useAppSelector((state) => state.user.user?.shop?.id);

  const userSlug = query.slug;

  const userLoading = useMemo(() => {
    return $s_userLoading || !!$s_userError;
  }, [$s_userLoading, $s_userError]);

  const remindAppOnWebApp = useEventCallback(async () => {
    if (!commonHelpers.isMobile()) return;
    const { isConfirmed } = await alertDialogService.fire({
      title: t("openAppConfirmationTitle"),
      content: t("openAppConfirmationContent"),
      actions: [
        {
          children: t("cancel"),
          buttonProps: {
            variant: "outlined",
            color: "text.primary",
          },
        },
        {
          children: t("open"),
          isConfirmAction: true,
          buttonProps: {
            variant: "contained",
            color: "text.primary",
          },
        },
      ],
    });
    if (!isConfirmed || !isMounted()) return;
    window.open(commonHelpers.generateUserProfileDeepLink($s_userId!), "_self");
  });

  useEffect(() => {
    const remindAppOnWebAppTimeout = setTimeout(remindAppOnWebApp, 1000);

    return () => {
      clearTimeout(remindAppOnWebAppTimeout);
    };
  }, [$s_userId]);

  const isMounted = useIsMounted();

  return (
    <SlugUserContext.Provider
      value={{
        userSlug,
      }}
    >
      <FetchData />
      <LoadingOverlay loading={userLoading} keepMounted>
        <div>
          <AppContainer disableGutters={"tabletDown"}>
            <UserProfileBanner />
          </AppContainer>
          <AppContainer disableGutters={"tabletDown"}>
            <Grid container wrap={isTabletDown ? "wrap" : "nowrap"}>
              <Grid item xs={12} tablet={"auto"}>
                <AppContainer disableGutters={"tabletUp"}>
                  <UserInfo />
                </AppContainer>
              </Grid>
              <Grid item xs={12} tablet="auto">
                <Divider
                  orientation={isTabletDown ? "horizontal" : "vertical"}
                />
              </Grid>
              <Grid item xs={12} tablet sx={{ overflow: "clip" }}>
                <MainContent />
              </Grid>
            </Grid>
          </AppContainer>
        </div>
      </LoadingOverlay>
    </SlugUserContext.Provider>
  );
};

export default SlugUser;
