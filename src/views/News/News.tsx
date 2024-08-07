import axios from "axios";
import { bindActionCreators } from "redux";

import { AppState, storeNewsItemAction } from "@/store";
import { commonHelpers, imageHelpers } from "@/utils/helpers";
import { commonConstants } from "@/utils/constants";

import { Divider, Grid, Skeleton } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppContent from "@/components/AppContent";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppPagination from "@/components/AppPagination";
import AppTypography from "@/components/AppTypography";
import NoSearchResults from "@/components/NoSearchResults";
import AppLink from "@/components/AppLink";
import PortalNewsHeader from "@/components/PortalNewsHeader";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AppImage from "@/components/AppImage";
import AppStickyBox from "@/components/AppStickyBox";
import AppListItemText from "@/components/AppListItemText";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppMomentWithLocale,
  useAppSelector,
  useEventCallback,
  useIsMounted,
} from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import useStyles from "./News.styles";

import type { FetchHelpCentersSagaAction } from "@/store/helpCenter/types";
import type { AppPaginationProps } from "@/components/AppPagination/AppPagination";
import type { CancelTokenSource } from "axios";
import type { NewsProps as PageNewsProps } from "@/pages/news";

type NewsProps = PageNewsProps;

const NEWS_ITEMS_LIMIT = 8;

const NewsItem = (props: {
  newsItem?: AppState["newsItem"]["newsItems"][number];
  loading?: boolean;
}) => {
  const { newsItem, loading } = props;

  const { classes } = useStyles();

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  return (
    <div className={classes.newsItem}>
      <div className={classes.newsItemMedia}>
        <div className={classes.newsItemMediaPhoto}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <AppImage
              src={newsItem?.img}
              loader={imageHelpers.appImageLoader}
              fill
              objectFit="cover"
              objectPosition="center"
            />
          )}
        </div>
      </div>
      <div className={classes.newsItemContent}>
        <AppTypography color="text.secondary">
          {!!loading ? (
            <Skeleton variant="text" sx={{ width: 120, maxWidth: "100%" }} />
          ) : (
            !!newsItem?.news_time &&
            momentWithLocaleByCurrentTz(newsItem?.news_time, "X").format(
              "YYYY-MM-DD"
            )
          )}
        </AppTypography>
        <AppTypography
          className={classes.newsItemContentTitle}
          variant="bodySemi16"
        >
          {!!loading ? (
            <Skeleton variant="text" sx={{ width: "100%" }} />
          ) : (
            newsItem?.title
          )}
        </AppTypography>
        <AppTypography className={classes.newsItemContentDescription}>
          {!!loading ? (
            <Skeleton variant="text" sx={{ width: "100%" }} />
          ) : (
            newsItem?.abstract
          )}
        </AppTypography>
      </div>
    </div>
  );
};

const RecentNewsItems = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const $s_recentNewsItems = useAppSelector(
    (state) => state.newsItem.recentNewsItems
  );
  const $s_recentNewsItemsLoading = useAppSelector(
    (state) => state.newsItem.recentNewsItemsLoading
  );
  const $s_recentNewsItemsError = useAppSelector(
    (state) => state.newsItem.recentNewsItemsError
  );

  return (
    <AppStickyBox
      thresholdTopEle={`#${commonConstants.PORTAL_HEADER_ELE_ID}`}
      offsetTop={20}
    >
      <AppList disablePadding>
        <AppListItem sx={{ px: 0 }}>
          <AppListItemText
            primary={t("recentNews")}
            primaryTypographyProps={{
              variant: "bodySemi16",
            }}
            sx={{ m: 0 }}
          />
        </AppListItem>
        <LoadingSkeleton
          count={3}
          loading={$s_recentNewsItemsLoading || !!$s_recentNewsItemsError}
          variant="custom"
          customSkeleton={
            <>
              <AppListItem sx={{ py: 0, px: 0, height: 0, minHeight: 0 }}>
                <Divider sx={{ width: "100%" }} />
              </AppListItem>
              <AppListItem sx={{ px: 0 }}>
                <Skeleton variant="text" sx={{ width: "100%" }} />
              </AppListItem>
            </>
          }
          GridItemProps={{
            xs: 12,
          }}
        >
          {$s_recentNewsItems.map((recentNewsItem) => (
            <Fragment key={recentNewsItem.id}>
              <AppListItem sx={{ py: 0, px: 0, height: 0, minHeight: 0 }}>
                <Divider sx={{ width: "100%" }} />
              </AppListItem>
              <AppListItem
                component={AppLink}
                href={{
                  pathname: `/news/${commonHelpers.generateSlug(
                    recentNewsItem.title,
                    recentNewsItem.id
                  )}`,
                  query: {
                    ...navigatedQuery,
                  },
                }}
                underline="none"
                sx={{ px: 0 }}
              >
                <AppListItemText primary={recentNewsItem.title} />
              </AppListItem>
            </Fragment>
          ))}
          {$s_recentNewsItems.length < 1 && (
            <>
              <Divider />
              <AppListItem sx={{ px: 0 }}>
                <AppListItemText
                  primary={t("noRecentNewsYet")}
                  primaryTypographyProps={{
                    color: "text.secondary",
                  }}
                />
              </AppListItem>
            </>
          )}
        </LoadingSkeleton>
      </AppList>
    </AppStickyBox>
  );
};

const News = (props: NewsProps) => {
  const { query } = props;

  const [newsItemsPage, setNewsItemsPage] = useState(
    commonHelpers.isNumber(query.page) ? Number(query.page) : 1
  );
  const curQueryPageRef = useRef<number | string>(query.page);

  const fetchNewsItemsSource = useRef<CancelTokenSource | null>(null);
  const fetchRecentNewsItemsSource = useRef<CancelTokenSource | null>(null);

  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const { t } = useTranslation();

  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const $s_newsItemAction = useMemo(
    () => bindActionCreators(storeNewsItemAction, dispatch),
    [dispatch]
  );

  const $s_newsItems = useAppSelector((state) => state.newsItem.newsItems);
  const $s_newsItemsCount = useAppSelector(
    (state) => state.newsItem.newsItemsCount
  );
  const $s_newsItemsLoading = useAppSelector(
    (state) => state.newsItem.newsItemsLoading
  );
  const $s_newsItemsError = useAppSelector(
    (state) => state.newsItem.newsItemsError
  );

  const fetchNewsItems = useEventCallback(
    (payload?: {
      params?: {
        page?: number;
        keyword?: string;
      };
    }) => {
      fetchNewsItemsSource.current?.cancel &&
        fetchNewsItemsSource.current.cancel();
      fetchNewsItemsSource.current = axios.CancelToken.source();

      let outerParams = commonHelpers.prepareRequestParams<
        NonNullable<FetchHelpCentersSagaAction["payload"]>["params"]
      >({
        page: payload?.params?.page!,
        query: payload?.params?.keyword!,
      });

      const curParams = commonHelpers.prepareRequestParams<
        NonNullable<FetchHelpCentersSagaAction["payload"]>["params"]
      >({
        page: newsItemsPage,
        query: query.keyword,
        ...outerParams,
        limit: NEWS_ITEMS_LIMIT,
      });

      $s_newsItemAction.fetchNewsItemsSaga({
        params: curParams,
        cancelToken: fetchNewsItemsSource.current.token,
      });
    }
  );

  const fetchRecentNewsItems = useEventCallback(() => {
    fetchRecentNewsItemsSource.current?.cancel &&
      fetchRecentNewsItemsSource.current.cancel();
    fetchRecentNewsItemsSource.current = axios.CancelToken.source();

    $s_newsItemAction.fetchRecentNewsItemsSaga({
      cancelToken: fetchRecentNewsItemsSource.current.token,
    });
  });

  const handleNewsItemsPaginationChange: AppPaginationProps["onChange"] = (
    _,
    newPage
  ) => {
    if (newPage !== newsItemsPage) {
      curQueryPageRef.current = `${newPage}`;
      setNewsItemsPage(newPage);
      fetchNewsItems({
        params: {
          page: newPage,
        },
      });
      router.push(
        {
          pathname: `/news`,
          query: {
            keyword: query.keyword,
            page: newPage,
            ...navigatedQuery,
          },
        },
        undefined,
        {
          scroll: false,
        }
      );
    }
    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    if (!isMounted()) return;
    fetchNewsItemsSource.current?.cancel &&
      fetchNewsItemsSource.current.cancel();
    fetchNewsItemsSource.current = axios.CancelToken.source();
    curQueryPageRef.current = "1";
    setNewsItemsPage(1);
    fetchNewsItems({
      params: {
        keyword: query.keyword,
        page: 1,
      },
    });
    router.push({
      pathname: `/news`,
      query: {
        keyword: query.keyword,
        page: 1,
        ...navigatedQuery,
      },
    });
  }, [query.keyword]);

  useEffect(() => {
    if (!isMounted()) return;
    if (
      query.page !== curQueryPageRef.current &&
      commonHelpers.isNumber(query.page)
    ) {
      const newPage = Number(query.page);
      setNewsItemsPage(newPage);
      fetchNewsItems({
        params: {
          page: newPage,
        },
      });
    }
  }, [query.page]);

  useEffect(() => {
    fetchNewsItems();
    fetchRecentNewsItems();
    return () => {
      fetchNewsItemsSource.current?.cancel &&
        fetchNewsItemsSource.current.cancel();
      fetchRecentNewsItemsSource.current?.cancel &&
        fetchRecentNewsItemsSource.current.cancel();

      fetchNewsItemsSource.current = null;
      fetchRecentNewsItemsSource.current = null;
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <div>
      <PortalNewsHeader />
      <AppContainer>
        <AppContent>
          {!!query.keyword && (
            <AppTypography variant="titleSemi20" mb={2.5}>
              {t("countSearchResultsForKeywordWithCount", {
                count: $s_newsItemsCount ?? 0,
                keyword: query.keyword,
              })}
            </AppTypography>
          )}
          <Grid container spacing={2.5}>
            <Grid item xs={12} tablet={8}>
              <LoadingSkeleton
                variant="custom"
                count={NEWS_ITEMS_LIMIT}
                keepMounted
                loading={$s_newsItemsLoading || !!$s_newsItemsError}
                GridContainerProps={{ spacing: 2.5 }}
                GridItemProps={{ xs: 12 }}
                customSkeleton={<NewsItem loading />}
              >
                <div className={classes.newsList}>
                  {$s_newsItems.length > 0 ? (
                    $s_newsItems.map((newsItem) => (
                      <AppLink
                        key={newsItem.id}
                        href={{
                          pathname: `/news/${commonHelpers.generateSlug(
                            newsItem.title,
                            newsItem.id
                          )}`,
                          query: {
                            ...navigatedQuery,
                          },
                        }}
                        underline="none"
                      >
                        <NewsItem newsItem={newsItem} />
                      </AppLink>
                    ))
                  ) : (
                    <NoSearchResults />
                  )}
                </div>
              </LoadingSkeleton>
              {Math.ceil($s_newsItemsCount / NEWS_ITEMS_LIMIT) > 1 && (
                <div className={classes.pagination}>
                  <AppPagination
                    page={newsItemsPage}
                    count={Math.ceil($s_newsItemsCount / NEWS_ITEMS_LIMIT)}
                    onChange={handleNewsItemsPaginationChange}
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: { tablet: "none" } }}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <RecentNewsItems />
            </Grid>
          </Grid>
        </AppContent>
      </AppContainer>
    </div>
  );
};

export default News;
